import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { Repository } from 'typeorm';
import { HeadersService } from '../headers/headers.service';
import { PaymentEntity } from '../payment/entities/payment.entity';

// import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class FetchStatusService {
  constructor(
    @InjectRepository(PaymentEntity)
    private paymentRepository: Repository<PaymentEntity>,
    private config: HeadersService,
  ) {}

  //* Schedule every 2s

  @Cron('*/2 * * * * *')
  async updatePaymentStatus() {
    const pending_payments = await this.paymentRepository.find({
      where: { payment_status: 'pending' },
    });

    for (const payment of pending_payments) {
      const {
        pay_token,
        payment_ref,
        gateway,
        auth_token,
        x_token,
        paytoken,
        transaction_id,
      } = payment;

      //* MTN GATEWAY
      if (gateway === 'mtnmomo') {
        try {
          const { data } = await axios.get(
            `${this.config.baseUrl()}/gateway/paymentstatus/${gateway}/${transaction_id}?pay_token="${pay_token}"&payment_ref="${payment_ref}"`,
            this.config.setHeaders(),
          );

          //? If response is succesful set status to success

          if (
            data?.status === 'SUCCSSFUL' &&
            data?.message === 'Your transaction completed succesfully'
          ) {
            payment.payment_status = 'success';
          }
          await this.paymentRepository.save(payment);
        } catch (error) {
          //? If there is an error in response, set status to failed

          if (error?.response?.data?.status === 'FAILED') {
            payment.payment_status = 'failed';
          }

          await this.paymentRepository.save(payment);
          return error?.response?.data;
        }
      }

      //* Orange GATEWAY
      else if (gateway === 'orange') {
        try {
          const { data } = await axios.get(
            `${this.config.baseUrl()}/gateway/paymentstatus/${gateway}/${transaction_id}?paytoken="${paytoken}"&auth-token="${auth_token}"&x-token="${x_token}"`,
            this.config.setHeaders(),
          );

          //? If response is succesful set status to success

          if (data?.status === 'SUCCESSFUL') {
            payment.payment_status = 'success';
          }

          await this.paymentRepository.save(payment);
        } catch (error) {

          //? If there is an error in response, set status to failed

          if (error.response.data?.status === "FAILED") {
            payment.payment_status = "failed"
         }

          await this.paymentRepository.save(payment) 
          return error?.response?.data
        }
        
      }
    }
  }
}
