import { IsDate, IsDateString, IsEmail, IsNumber, IsPhoneNumber, IsString } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Users } from '../../users/entities/users.entity'

@Entity()
export class Sitter {
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

    @OneToMany(() => Users, (user) => user.sitter)
    users: Users[];
}
