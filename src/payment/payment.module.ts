import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { HeadersService } from '../headers/headers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionEntity } from '../transaction/entities/transaction.entity';
import { TransactionModule } from '../transaction/transaction.module';
import { PaymentEntity } from './entities/payment.entity';
import { FetchStatusService } from '../fetch-status/fetch-status.service'

@Module({
  controllers: [PaymentController],
  providers: [PaymentService, HeadersService, FetchStatusService],
  imports: [TransactionModule, TypeOrmModule.forFeature([PaymentEntity, TransactionEntity])],
  exports: [TypeOrmModule],
})
export class PaymentModule {}
