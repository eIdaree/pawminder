import { forwardRef, Module } from "@nestjs/common";
import { PetsService } from "./pets.service";
import { PetsController } from "./pets.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Pet } from "./entities/pet.entity";
import { Users } from "../users/entities/users.entity";
import { TasksModule } from "src/tasks/tasks.module";
import { OrdersModule } from "src/orders/orders.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Pet, Users]),
    TasksModule,
    forwardRef(() => OrdersModule),
  ],
  controllers: [PetsController],
  providers: [PetsService],
  exports: [PetsService, TypeOrmModule],
})
export class PetsModule {}
