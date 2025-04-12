// src/notes/note.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from "typeorm";
import { Pet } from "../../pets/entities/pet.entity";

@Entity()
export class Note {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: "text" })
  content: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Pet, (pet) => pet.notes, { onDelete: "CASCADE" })
  pet: Pet;
}
