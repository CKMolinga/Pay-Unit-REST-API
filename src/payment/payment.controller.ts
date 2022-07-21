import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('makepayment/:transaction_id')
  makePayment(@Body() body:CreatePaymentDto, @Param('transaction_id') transaction_id: string) {
    //todo: return this.paymentService.makePayment(body, transaction_id);
  }

  @Get('payment-status/:transaction_id')
  getPaymentStatus(@Param('transaction_id') transaction_id: string) {
    //todo: return this.paymentService.getPaymentStatus(transaction_id);
  }
}
