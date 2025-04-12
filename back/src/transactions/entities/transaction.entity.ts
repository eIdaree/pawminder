import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { Users } from "src/users/entities/users.entity";

export type TransactionType = "income" | "expense";

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  amount: number;

  @Column()
  type: TransactionType;

  @Column()
  description: string;

  @ManyToOne(() => Users, (user) => user.transactions, { eager: true })
  user: Users;

  @CreateDateColumn()
  createdAt: Date;
}
