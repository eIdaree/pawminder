import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { IsEmail, IsString, IsDate, IsPhoneNumber, IsBoolean, IsDateString } from 'class-validator';
import { Pet } from '../../pets/entities/pet.entity';
import { Sitter } from '../../sitters/entities/sitter.entity';


export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsString()
  first_name: string;

  @Column()
  @IsString()
  last_name: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  @IsString()
  password: string;

  @Column({ type: 'date' })
  @IsDateString()
  date_of_birth: string;

  @Column({ unique: true })
  @IsPhoneNumber(null)
  phone: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  role: Role;
  
  @Column({ default: true })
  @IsBoolean()
  isActivated: boolean;

  @OneToMany(() => Pet, (pet) => pet.user, { cascade: true })
  pets: Pet[];
  
  @ManyToOne(()=> Sitter, (sitter) => sitter.users)
  sitter: Sitter;
  
  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
