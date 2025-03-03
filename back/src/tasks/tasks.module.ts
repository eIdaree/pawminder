// src/tasks/tasks.module.ts
import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Pet } from '../pets/entities/pet.entity'; 

@Module({
  imports: [TypeOrmModule.forFeature([Task, Pet])],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
