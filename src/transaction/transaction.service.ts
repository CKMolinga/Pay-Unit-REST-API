import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { HeadersService } from '../headers/headers.service';
import { TransactionEntity } from './entities/transaction.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly transactionRepository: Repository<TransactionEntity>,
    private config: HeadersService,
  ) {}

  async initiatePayment(body) {
    const { total_amount, currency, return_url } = body;

    //Check if currency isNOT XAF or USD, then throw an exception
    if (currency !== 'XAF' && currency !== 'USD') {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: `Currency ${currency} is not supported, please use either XAF or USD`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    //Generate a unique transaction id using uuid
    const transaction_id = uuid();

    //Destructuring the body object with the transaction ID into a new object called transactionProperties
    const transactionProperties = {
      ...body,
      transaction_id,
    };

    //Then create(POST) a new payment transaction
    try {
      const { data } = await axios.post(
        `${this.config.baseUrl()}/gateway/initialize`,
        transactionProperties,
        this.config.setHeaders(),
      );

      // The data sent is been saved to a data object, so to access it we assign to a variable called payload
      const payload = data.data;
      const { t_id, t_sum, t_url } = payload;

      const encryptedProperties = {
        t_id,
        t_sum,
        t_url,
      };

      const dbData = this.transactionRepository.create({
        ...transactionProperties,
        ...encryptedProperties,
      });

      await this.transactionRepository.save(dbData);

      return {
        msg: 'Transaction succesfully initiated',
        transaction_id,
      };
    } catch (error) {
        
      return {
        msg: error
      };
    }
  }
}
