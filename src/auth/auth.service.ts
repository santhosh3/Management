import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { AuthDto } from './dto/auth.dto';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly jwt: JwtService,
  ) {}

  async login(dto: AuthDto) {
    const { email, password } = dto;

    const foundUser = await this.databaseService.user.findUnique({
      where: { email }
    });

    if (!foundUser) {
      throw new BadRequestException('Wrong credentials');
    }

    const isMatch = await argon2.verify(foundUser.password, password);

    if (!isMatch) {
      throw new BadRequestException('Wrong credentials');
    }

    const token = this.jwt.sign({id:foundUser.id});

    const {id, name, isDeleted, image, createdAt, updatedAt} = foundUser

    return { token, user:{id, name, email, image, isDeleted, createdAt, updatedAt} };
  }
}
