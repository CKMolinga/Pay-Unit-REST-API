import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('makepayment/:transaction_id')
  makePayment(
    @Body() body: CreatePaymentDto,
    @Param('transaction_id') transaction_id: string,
  ) {
    return this.paymentService.makePayment(body, transaction_id);
  }

  @Get('paymentStatus/:transaction_id')
  getPaymentStatus(@Param('transaction_id') transaction_id: string) {
    return this.paymentService.getPaymentStatus(transaction_id);
  }
}
