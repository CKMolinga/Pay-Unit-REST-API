import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { HeadersService } from '../headers/headers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from './entities/auth.entity';

@Module({
  controllers: [AuthController],
  providers: [AuthService, HeadersService],
  exports: [AuthService, HeadersService, TypeOrmModule],
  imports: [TypeOrmModule.forFeature([Auth])],
})
export class AuthModule {}
