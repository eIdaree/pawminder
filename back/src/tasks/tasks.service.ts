import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Pet } from '../pets/entities/pet.entity';

@Injectable()
export class TasksService {
  
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    @InjectRepository(Pet)
    private readonly petRepository: Repository<Pet>,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const pet = await this.petRepository.findOne({ where: { id: createTaskDto.petId } });
  
    if (!pet) {
      throw new NotFoundException(`Pet with ID ${createTaskDto.petId} not found`);
    }
  
    const task = this.taskRepository.create({
      title: createTaskDto.title,
      pet: pet,  
    });
  
    return this.taskRepository.save(task);
  }
  

  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.taskRepository.preload({
      id,
      ...updateTaskDto,
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return this.taskRepository.save(task);
  }

  async remove(id: number): Promise<boolean> {
    const task = await this.taskRepository.findOne({ where: { id } });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    await this.taskRepository.remove(task);
    return true;
  }
  async findAll(): Promise<Task[]> {
    return this.taskRepository.find();
  }
  async findTasksByPet(petId: number): Promise<Task[]> {
    return this.taskRepository.find({
      where: { pet: { id: petId } },
      relations: ['pet'],  
    });
  }
  

  async findPetById(petId: number): Promise<Pet | null> {
    return this.petRepository.findOne({ where: { id: petId } });
  }
}
