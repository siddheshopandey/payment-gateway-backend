import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateMerchantDto } from './dto/create-merchant.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() createMerchantDto: CreateMerchantDto) {
    return this.authService.register(createMerchantDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
