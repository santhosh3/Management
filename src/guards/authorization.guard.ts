import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
    HttpServer
  } from '@nestjs/common';
  import { Observable } from 'rxjs';
  import { JwtService } from '@nestjs/jwt/dist';
  
  @Injectable()
  export class AuthenticationGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) {}
    async canActivate(
      context: ExecutionContext,
    ): Promise<boolean> {
       try {

      } catch (error) {
        
       }
       return true;
    }
  }
  