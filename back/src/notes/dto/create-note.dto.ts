// src/notes/dto/create-note.dto.ts
import { IsNotEmpty, IsString } from "class-validator";

export class CreateNoteDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  content: string;
}
