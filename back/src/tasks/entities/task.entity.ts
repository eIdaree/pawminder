import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Pet } from '../../pets/entities/pet.entity'; 

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string; 

  @Column({ default: false })
  completed: boolean; 

  @ManyToOne(() => Pet, (pet) => pet.tasks)
  pet: Pet;
  
  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
