import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreatePaymentDto {
    @IsString()
    @IsNotEmpty()
    gateway: string;

    @IsNotEmpty()
    phone_number: string | number

    @IsString()
    @IsOptional()
    notify_url: string | null;

    @IsString()
    @IsOptional()
    name: string | null;
}
