import { Body, Controller, Get, Post, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  Login(@Body() dto: AuthDto) {
    return this.authService.login(dto);
  }

  @Get('verify')
  getHeaders(@Headers() headers: any) {
    return this.authService.verify(headers);
  }
}
