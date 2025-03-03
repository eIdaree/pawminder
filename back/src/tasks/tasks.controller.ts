import { Controller, Get, Post, Body, Param, Put, Delete, BadRequestException, NotFoundException } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Pet } from '../pets/entities/pet.entity';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async create(@Body() createTaskDto: CreateTaskDto) {
    const task = await this.tasksService.create(createTaskDto);
    return task;
  }
  
  @Get('/pet/:petId')
  async findTasksByPet(@Param('petId') petId: number) {
    const tasks = await this.tasksService.findTasksByPet(petId);
    if (tasks.length === 0) {
      throw new NotFoundException(`No tasks found for pet with ID ${petId}`);
    }
    return tasks;
  }
  @Get()
  findAll() {
    return this.tasksService.findAll();
  }
  @Put(':id')
  async update(@Param('id') id: number, @Body() updateTaskDto: UpdateTaskDto) {
    const task = await this.tasksService.update(id, updateTaskDto);
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    await this.tasksService.remove(id);
    return { message: 'Task removed successfully' };
  }

}
