import { Body, Controller, Get, Param, Post,} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('initiate')
  initiatePayment(@Body() body: CreateTransactionDto) {
    return this.transactionService.initiatePayment(body);
  }

  @Get('getpsp/:transaction_id')
  getPsp(@Param('transaction_id') transaction_id: string) {
    // return this.transactionService.getPsp(transaction_id);
  }
 
}
