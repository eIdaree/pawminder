// src/notes/notes.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from "@nestjs/common";
import { NotesService } from "./notes.service";
import { CreateNoteDto } from "./dto/create-note.dto";

@Controller("notes")
export class NotesController {
  constructor(private notesService: NotesService) {}

  @Get("pet/:petId")
  getByPet(@Param("petId") petId: number) {
    return this.notesService.findByPet(petId);
  }

  @Get(":id")
  getOne(@Param("id") id: number) {
    return this.notesService.findOne(id);
  }

  @Post(":petId")
  create(@Param("petId") petId: number, @Body() dto: CreateNoteDto) {
    return this.notesService.create(petId, dto);
  }

  @Patch(":id")
  update(@Param("id") id: number, @Body() dto: CreateNoteDto) {
    return this.notesService.update(id, dto);
  }

  @Delete(":id")
  delete(@Param("id") id: number) {
    return this.notesService.delete(id);
  }
}
