import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Users } from "../../users/entities/users.entity";
import { Task } from "src/tasks/entities/task.entity";
import { Order } from "src/orders/entities/order.entity";

@Entity()
export class Pet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  species: string;

  @Column()
  breed: string;

  @Column()
  gender: string;

  @Column({ nullable: true })
  photo: string;

  @Column()
  weight: number;

  @Column()
  date_of_birth: Date;

  @Column()
  color: string;

  @Column()
  activity: string;

  @Column()
  character: string;

  @OneToMany(() => Task, (task) => task.pet)
  tasks: Task[];
  @OneToMany(() => Order, (order) => order.pet)
  orders: Order[];

  @ManyToOne(() => Users, (user) => user.pets, { onDelete: "CASCADE" })
  user: Users;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
