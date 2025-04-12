import { forwardRef, Module } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { OrdersController } from "./orders.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Order } from "./entities/order.entity";
import { Users } from "src/users/entities/users.entity";
import { PetsModule } from "src/pets/pets.module";
import { UsersModule } from "src/users/users.module";
import { Pet } from "src/pets/entities/pet.entity";
import { TransactionsModule } from "src/transactions/transactions.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, Users, Pet]),
    forwardRef(() => PetsModule),
    UsersModule,
    TransactionsModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
