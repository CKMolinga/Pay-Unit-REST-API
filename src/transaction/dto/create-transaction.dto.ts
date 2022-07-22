import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsInt,
  IsNotEmpty,
  ValidateIf,
  IsOptional,
} from 'class-validator';

enum Currencies {
  XAF = 'XAF',
  USD = 'USD',
}

export class CreateTransactionDto {
  @IsInt()
  @IsNotEmpty()
  @ApiProperty({ example: 5000 })
  total_amount: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: "XAF" })
  currency: Currencies;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: "https://www.mywebsite.com/next" })
  return_url: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: "https://www.mywebsite.com/next" })
  notify_url: string | null;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: "CK Molinga" })
  name: string | null;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: "Initiate payment transaction" })
  description: string | null;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: "" })
  purchaseRef: string | null;
}
