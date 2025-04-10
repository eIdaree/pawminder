import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Users } from "../../users/entities/users.entity";
import { Pet } from "../../pets/entities/pet.entity";

export enum OrderStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  COMPLETED = "completed",
  REJECTED = "rejected",
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "date" })
  startDate: string;

  @Column({ type: "date" })
  endDate: string;

  @Column({ nullable: true })
  careTime: string;

  @Column("simple-array", { nullable: true })
  services: string[];

  @Column({ type: "int" })
  fee: number;

  @Column({ type: "enum", enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Column({ nullable: true })
  rating?: number;

  @Column({ nullable: true })
  review?: string;

  @Column({ nullable: true })
  notes?: string;

  @ManyToOne(() => Users, (user) => user.orders, { eager: true })
  user: Users;

  @ManyToOne(() => Users, (sitter) => sitter.assignedOrders, {
    eager: true,
  })
  sitter: Users;
  @Column({ type: "int", nullable: true })
  platformCommission?: number;

  @ManyToOne(() => Pet, (pet) => pet.orders, { eager: true })
  pet: Pet;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
