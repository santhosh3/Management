import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt/dist';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService,
              private readonly databaseService: DatabaseService) {}
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const token = request.headers.authorization.split(' ')[1];
      if (!token) {
        throw new UnauthorizedException();
      }
      const userId = this.jwtService.verify(token);
      const {iat,exp} = userId
      const user = await this.databaseService.user.findUnique({where : {id : userId.id}});
      const {id, name, email, roleId} = user
      request.user = {id, name, email, roleId, exp, iat}
    } catch (error) {
      throw new UnauthorizedException();
    }
    return true;
  }
}
