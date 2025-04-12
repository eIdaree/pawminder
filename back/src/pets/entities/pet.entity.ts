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
import { Note } from "src/notes/entities/note.entity";

@Entity()
export class Pet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  species: string;

  @Column({ default: "" })
  breed: string;

  @Column()
  gender: string;

  @Column({ nullable: true })
  photo: string;

  @Column("float", { default: 0 })
  weight: number;

  @Column()
  date_of_birth: Date;

  @Column()
  color: string;

  // Храним массивы как "simple-array" (каждый элемент будет разделен запятой)
  @Column("simple-array", { default: "" })
  activity: string[];

  @Column("simple-array", { default: "" })
  character: string[];

  // Новые поля (опционально)
  @Column({ nullable: true })
  petDescription: string;

  @Column({ nullable: true })
  additionalNotes: string;

  @OneToMany(() => Task, (task) => task.pet)
  tasks: Task[];

  @OneToMany(() => Order, (order) => order.pet)
  orders: Order[];

  @OneToMany(() => Note, (note) => note.pet)
  notes: Note[];

  @ManyToOne(() => Users, (user) => user.pets, { onDelete: "CASCADE" })
  user: Users;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
