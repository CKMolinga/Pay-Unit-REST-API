import { IsString, IsInt, IsNotEmpty, ValidateIf, IsOptional } from 'class-validator';

enum Currencies {
    XAF="XAF",
    USD="USD",
}

export class CreateTransactionDto {
    @IsInt()
    @IsNotEmpty()
    total_amount:number;

    @IsString()
    @IsNotEmpty()
    currency:Currencies

    @IsString()
    @IsNotEmpty()
    return_url:string

    @IsString()
    @IsOptional()
    notify_url: string | null;

    @IsString()
    @IsOptional()
    name: string | null;	

    @IsString()
    @IsOptional()
    description: string | null;

    @IsString()
    @IsOptional()
    purchaseRef: string | null;
}
