// src/transactions/transactions.module.ts
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TransactionsService } from "./transactions.service";
import { TransactionsController } from "./transactions.controller";
import { Transaction } from "./entities/transaction.entity";
import { UsersModule } from "src/users/users.module";
import { Users } from "src/users/entities/users.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, Users]), UsersModule],
  providers: [TransactionsService],
  controllers: [TransactionsController],
  exports: [TransactionsService],
})
export class TransactionsModule {}
