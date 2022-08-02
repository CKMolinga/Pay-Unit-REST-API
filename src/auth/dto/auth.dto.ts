import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthDto {
  @IsString()
  @IsNotEmpty()
  user_id: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'ckmolinga@gmail.com' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'test123' })
  password: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'ck.molinga' })
  username: string;
}
