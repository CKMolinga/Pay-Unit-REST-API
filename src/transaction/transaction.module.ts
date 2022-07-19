import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionEntity } from './entities/transaction.entity';
import { HeadersService } from '../headers/headers.service';

@Module({
  controllers: [TransactionController],
  providers: [TransactionService, HeadersService],
  exports: [TypeOrmModule,TransactionService,HeadersService],
  imports: [TypeOrmModule.forFeature([TransactionEntity])],
})
export class TransactionModule {}
