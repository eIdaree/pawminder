import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  UpdateDateColumn,
} from "typeorm";
import {
  IsEmail,
  IsString,
  IsDateString,
  IsPhoneNumber,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsNumber,
} from "class-validator";
import { Pet } from "../../pets/entities/pet.entity";
import { Order } from "../../orders/entities/order.entity";
import { Transaction } from "src/transactions/entities/transaction.entity";

export enum Role {
  USER = "user",
  SITTER = "sitter",
  ADMIN = "admin",
}

export enum VerificationStatus {
  UNVERIFIED = "unverified",
  PENDING = "pending",
  VERIFIED = "verified",
  REJECTED = "rejected",
}

export enum SitterLevel {
  BEGINNER = "Beginner",
  EXPERIENCED = "Experienced",
  EXPERT = "Expert",
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

  @Column({ type: "date" })
  @IsDateString()
  date_of_birth: string;

  @Column({ unique: true })
  @IsPhoneNumber(null)
  phone: string;

  @Column({ type: "float", default: 0 })
  balance: number;

  @Column({
    type: "enum",
    enum: Role,
    default: Role.USER,
  })
  @IsEnum(Role)
  role: Role;

  @Column({ default: true })
  @IsBoolean()
  isActivated: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions: Transaction[];

  // 🐶🐱 Только для sitter

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Column("text", { array: true, nullable: true })
  @IsOptional()
  petTypes?: string[];

  @Column("text", { array: true, nullable: true })
  @IsOptional()
  skills?: string[];

  @Column("text", { array: true, nullable: true })
  @IsOptional()
  tags?: string[];

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  location?: string;

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  certificateUrl?: string;

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @Column({
    type: "enum",
    enum: VerificationStatus,
    default: VerificationStatus.UNVERIFIED,
  })
  @IsEnum(VerificationStatus)
  verificationStatus: VerificationStatus;

  @Column({ default: 0 })
  completedOrdersCount: number;

  @Column({ default: 0 })
  @IsNumber()
  averageRating: number;

  @Column({
    type: "enum",
    enum: SitterLevel,
    default: SitterLevel.BEGINNER,
  })
  @IsEnum(SitterLevel)
  level: SitterLevel;

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  title?: string;

  @Column({ default: 0 })
  @IsNumber()
  hourlyRate: number;

  @Column({ default: 0 })
  @IsNumber()
  platformCommission: number;

  @OneToMany(() => Pet, (pet) => pet.user)
  pets: Pet[];

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @OneToMany(() => Order, (order) => order.sitter)
  assignedOrders: Order[];
}
