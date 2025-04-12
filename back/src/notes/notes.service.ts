// src/notes/notes.service.ts
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Note } from "./entities/note.entity";
import { Pet } from "src/pets/entities/pet.entity";
import { CreateNoteDto } from "./dto/create-note.dto";

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note) private noteRepo: Repository<Note>,
    @InjectRepository(Pet) private petRepo: Repository<Pet>,
  ) {}

  async findByPet(petId: number): Promise<Note[]> {
    return this.noteRepo.find({
      where: { pet: { id: petId } },
      order: { created_at: "DESC" },
    });
  }

  async findOne(id: number): Promise<Note> {
    const note = await this.noteRepo.findOne({ where: { id } });
    if (!note) throw new NotFoundException("Note not found");
    return note;
  }

  async create(petId: number, dto: CreateNoteDto): Promise<Note> {
    const pet = await this.petRepo.findOne({ where: { id: petId } });
    if (!pet) throw new NotFoundException("Pet not found");

    const note = this.noteRepo.create({ ...dto, pet });
    return this.noteRepo.save(note);
  }

  async update(id: number, dto: CreateNoteDto): Promise<Note> {
    const note = await this.findOne(id);
    Object.assign(note, dto);
    return this.noteRepo.save(note);
  }

  async delete(id: number): Promise<void> {
    await this.noteRepo.delete(id);
  }
}
