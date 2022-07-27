import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePaymentDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'mtnmomo' })
  gateway: string;

  @IsNotEmpty()
  @ApiProperty({ example: 671248910 })
  phone_number: string | number;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'http://www.mywebsite/return' })
  notify_url: string | null;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'CK Molinga' })
  name: string | null;
}
