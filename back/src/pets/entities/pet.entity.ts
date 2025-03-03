import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Users } from '../../users/entities/users.entity';
import { Task } from 'src/tasks/entities/task.entity';

@Entity()
export class Pet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  species: string;

  @Column({ nullable: true })
  breed: string;

  @Column()
  weight: number;

  @Column()
  date_of_birth: Date;

  @OneToMany(() => Task, (task) => task.pet) 
  tasks: Task[];

  @ManyToOne(() => Users, (user) => user.pets, { onDelete: 'CASCADE' })
  user: Users;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
