import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly jwt: JwtService,
  ) {}

  async login(dto: AuthDto) {
    const { email, password } = dto;
    console.log(email,password);
    const foundUser = await this.databaseService.user.findUnique({
      where: { email }
    });
  
    if (!foundUser) {
      throw new BadRequestException('Email not found');
    }

    if(foundUser.isDeleted === true){
       throw new BadRequestException('Inactive User');
    }


   const isMatch =  await bcrypt.compare(password, foundUser.password);
   console.log(password,foundUser.password)

    if (!isMatch) {
      throw new BadRequestException('Password is Wrong');
    }

    const token = this.jwt.sign({id:foundUser.id});

    const {id, name, isDeleted, image, createdAt, updatedAt} = foundUser

    return { token, user:{id, name, email, image, isDeleted, createdAt, updatedAt} };
  }
}
