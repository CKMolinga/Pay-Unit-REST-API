import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HeadersService } from '../headers/headers.service';
import { TransactionEntity } from './entities/transaction.entity';

@Injectable()
export class TransactionService {
 constructor (
    @InjectRepository(TransactionEntity)
    private readonly transactionRepository: Repository<TransactionEntity>,
    private config: HeadersService,
 ) {}
}
