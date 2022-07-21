import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { Repository } from 'typeorm';
import { HeadersService } from '../headers/headers.service';
import { TransactionEntity } from '../transaction/entities/transaction.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentEntity } from './entities/payment.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(TransactionEntity)
    private transactionRepository: Repository<TransactionEntity>,
    @InjectRepository(PaymentEntity)
    private paymentRepository: Repository<PaymentEntity>,
    private config: HeadersService,
  ) {}

  //* Make payment for a transaction
  async makePayment(body, transaction_id) {
    const { phone_number, gateway } = body;

    //? Check if PSP is valid
    if (gateway !== 'mtnmomo' && gateway !== 'orange') {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Invalid gateway, please use either mtnmomo or orange',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    //? Check if phone number is valid
    if (typeof phone_number == 'number') {
      //* convert number to string
      phone_number.toString();
    }

    //? Check if phone number is a cameroonian phone number using regex
    const isCameroonianPhoneNumber = /^6[5789]{1}[0-9]{7}$/.test(phone_number);

    //? If number is not cameroon number, throw error
    if (!isCameroonianPhoneNumber) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: `${phone_number} is not a valid MTN or Orange Cameroonian phone number`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const transaction = await this.transactionRepository.findOne({
      where: { transaction_id },
    });

    //? Check if there is no transaction, throw an error
    if (!transaction) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: `Transaction ${transaction_id} does not exist`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const { currency, total_amount: amount } = transaction;

    const paymentType = 'button';

    const paymentData = {
      ...body,
      paymentType,
      currency,
      amount,
      transaction_id,
    };

    //* create payment
    try {
      const { data } = await axios.post(
        `${this.config.baseUrl()}/gateway/makepayment`,
        paymentData,
        this.config.setHeaders(),
      );

      const { pay_token, payment_ref, auth_token, x_token, paytoken } =
        data?.data;

      const payment = this.paymentRepository.create({
        pay_token,
        payment_ref,
        auth_token,
        x_token,
        paytoken,
        transaction_id,
        gateway,
      });
      await this.paymentRepository.save(payment);

      return data;
    } catch (error) {
      return error?.response?.data;
    }
  }

  //* Get payment status
  async getPaymentStatus(transaction_id) {
    const payment = await this.paymentRepository.findOne({
      where: { transaction_id },
    });

    //? Check if there is no payment, throw an error
    if (!payment) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: `Payment for transaction ${transaction_id} does not exist`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const { pay_token, payment_ref, gateway, auth_token, x_token, paytoken } =
      payment;

    //? if PSP is MTN MOMO, get payment status
    if (gateway === 'mtnmomo') {
      try {
        const { data } = await axios.get(
          `${this.config.baseUrl()}/gateway/paymentstatus/${gateway}/${transaction_id}?pay_token="${pay_token}"&payment_ref="${payment_ref}"`,
          this.config.setHeaders(),
        );

        return data;
      } catch (error) {
        return error?.response?.data;
      }
    }

    //? else if PSP is ORANGE, get payment status
    else if (gateway === 'orange') {
      try {
        const {data} = await axios.get(`${this.config.baseUrl()}/gateway/paymentstatus/${gateway}/${transaction_id}?paytoken="${paytoken}"&auth-token="${auth_token}"&x-token="${x_token}"`,this.config.setHeaders())  
    return data
      } catch (error) {
        return error?.response?.data;
      }
    }
  }
}
