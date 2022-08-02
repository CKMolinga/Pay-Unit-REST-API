import {
  Controller,
  Get,
  Post,
  Body,
  Param,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //* Sign Up
  @Post('signup')
  signup(@Body() createAuthDto: AuthDto) {
    return this.authService.signUp(createAuthDto);
  }

  //* Login
  @Get(':id')
  findOne(@Param('id') id: string) {
    // return this.authService.findOne(+id);
  }
}
