import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransactionEntity } from './transaction/entities/transaction.entity';
import { TransactionModule } from './transaction/transaction.module';
import { HeadersService } from './headers/headers.service';
import { TransactionController } from './transaction/transaction.controller';
import { TransactionService } from './transaction/transaction.service';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [
    TransactionModule,
    ConfigModule.forRoot({ isGlobal: true, }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'admin',
      password: 'New2022pass',
      database: 'payment',
      entities: [TransactionEntity],
      synchronize: true,
    }),
    PaymentModule,
  ],
  controllers: [AppController,TransactionController],
  providers: [AppService, HeadersService,TransactionService],
})
export class AppModule {}
