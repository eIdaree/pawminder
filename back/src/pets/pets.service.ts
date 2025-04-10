import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Pet } from "./entities/pet.entity";
import { CreatePetDto } from "./dto/create-pet.dto";
import { UpdatePetDto } from "./dto/update-pet.dto";

@Injectable()
export class PetsService {
  constructor(@InjectRepository(Pet) private petsRepository: Repository<Pet>) {}

  create(userId: number, createPetDto: CreatePetDto) {
    const pet = this.petsRepository.create({
      ...createPetDto,
      user: { id: userId },
    });
    return this.petsRepository.save(pet);
  }

  findAllByUserId(userId: number) {
    return this.petsRepository.find({
      where: { user: { id: userId } },
      relations: ["tasks"],
    });
  }

  async findOneByUserId(userId: number, id: number) {
    const pet = await this.petsRepository.findOne({
      where: { id, user: { id: userId } },
      relations: ["tasks"],
    });

    if (!pet) {
      throw new NotFoundException(`Pet with ID ${id} not found`);
    }

    return pet;
  }
  async findOne(id: number) {
    const pet = await this.petsRepository.findOne({
      where: { id: id },
      relations: ["user"],
    });
    return pet;
  }

  async update(userId: number, petId: number, updatePetDto: UpdatePetDto) {
    const pet = await this.petsRepository.findOne({
      where: { id: petId, user: { id: userId } },
    });

    if (!pet) {
      throw new NotFoundException(`Pet with ID ${petId} not found`);
    }

    return this.petsRepository.save({
      ...pet,
      ...updatePetDto,
    });
  }

  async remove(userId: number, petId: number) {
    const pet = await this.petsRepository.findOne({
      where: { id: petId, user: { id: userId } },
    });

    if (!pet) {
      throw new NotFoundException(`Pet with ID ${petId} not found`);
    }

    await this.petsRepository.remove(pet);
  }
}
