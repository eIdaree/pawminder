// src/notes/notes.module.ts
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Note } from "./entities/note.entity";
import { NotesService } from "./notes.service";
import { NotesController } from "./notes.controller";
import { Pet } from "src/pets/entities/pet.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Note, Pet])],
  providers: [NotesService],
  controllers: [NotesController],
})
export class NotesModule {}
