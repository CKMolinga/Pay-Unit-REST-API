import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TransactionEntity } from './transaction/entities/transaction.entity';
import { TransactionModule } from './transaction/transaction.module';
import { HeadersService } from './headers/headers.service';
import { TransactionController } from './transaction/transaction.controller';
import { TransactionService } from './transaction/transaction.service';
import { PaymentModule } from './payment/payment.module';
import { PaymentEntity } from './payment/entities/payment.entity';
import { FetchStatusService } from './fetch-status/fetch-status.service';

@Module({
  imports: [
    TransactionModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'ec2-44-208-88-195.compute-1.amazonaws.com',
      port: 5432,
      username: 'equvibzaihmlpg',
      password:
        'eef6cef4fca03561af92c7a5eef74aada5e163468089d56b594dd2c1388e2f94',
      database: 'dbq8vin8c9uq9b',
      entities: [TransactionEntity, PaymentEntity],
      synchronize: true,
      url: 'postgres://equvibzaihmlpg:eef6cef4fca03561af92c7a5eef74aada5e163468089d56b594dd2c1388e2f94@ec2-44-208-88-195.compute-1.amazonaws.com:5432/dbq8vin8c9uq9b',
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
      // synchronize: true,
      // type: 'mysql',
      // host: 'localhost',
      // port: 3306,
      // username: 'admin',
      // password: 'New2022pass',
      // database: 'payment',
      // entities: [TransactionEntity, PaymentEntity],
      // synchronize: true,
    }),
    PaymentModule,
  ],
  controllers: [AppController, TransactionController, TransactionController],
  providers: [
    AppService,
    HeadersService,
    TransactionService,
    TransactionService,
    FetchStatusService,
  ],
})
export class AppModule {}
