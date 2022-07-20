import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { response } from 'express';
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

    //?Check if currency isNOT XAF or USD, then throw an exception
    if (currency !== 'XAF' && currency !== 'USD') {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: `Currency ${currency} is not supported, please use either XAF or USD`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    //*Generate a unique transaction id using uuid
    const transaction_id = uuid();

    //*Destructuring the body object with the transaction ID into a new object called transactionProperties, so we now have a new object with the transaction ID
    const transactionProperties = {
      ...body,
      transaction_id,
    };

    //*Then create(POST) a new payment transaction
    try {
      const data  = await axios
        .post(
          `${this.config.baseUrl()}/gateway/initialize`,
          transactionProperties,
          this.config.setHeaders(),
        )
        .then(async(response) => {
          console.log(response.data)
          const dbData = await this.transactionRepository.save({
            total_amount: total_amount,
            currency: currency,
            return_url: return_url,
            //todo: The data returned is stored in a data object, so we can extract it into a new object "payload" to avoid "data.data" long query
            transaction_id: response.data.data.transaction_id,
            t_sum: response.data.data.t_sum,
            t_url: response.data.data.t_url,
            t_id: response.data.data.t_id,
          })
          console.log(dbData);
          return dbData;
        });
        console.log(data);
        return data

        //todo: DO NOT DELETE comment below: for better understanding of the code
      // The data sent is been saved to a data object, so to access it we assign to a variable called payload
      // const payload = data.data;

      // const { t_id, t_sum, t_url } = payload;

      // // We filter the necessary properties from the payload object and assign them to a new object called encryptedProperties
      // const encryptedProperties = {
      //   t_id,
      //   t_sum,
      //   t_url,
      // };

      // const dbData = this.transactionRepository.create({
      //   ...transactionProperties,
      //   ...encryptedProperties,
      // });

      // await this.transactionRepository.save(dbData);

      //* return data;
    } catch (error) {
      return {
        msg: error.message,
      };
    }
  }

  // *Get PSPs
  async getPsp(transaction_id) {

    //?check if there is no Transaction ID, throw an error exception 
    if (!transaction_id) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: `Transaction ID is required`,
        },
        HttpStatus.BAD_REQUEST,
      )
    }

    //*Get the transaction from the database
    const transactionData = await this.transactionRepository.findOne({
      where: {transaction_id},
    })

    //?If there is no transaction, throw an error exception
    if(!transactionData) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: `Transaction ID ${transaction_id} is not found`,
        },
        HttpStatus.BAD_REQUEST,
      )
    }

    //
    const { t_id, t_sum, t_url } = transactionData;

    //*Get the PSP from the database
    try {
      const {data} = await axios.get(
        `${this.config.baseUrl()}/gateway/gateways?t_url="${t_url}"&t_id="${t_id}"&t_sum="${t_sum}"`,
        this.config.setHeaders(),
      )
      return data;
    }
    catch (error) {
      return {
        msg: error.message,
      };
    }
  }
}
