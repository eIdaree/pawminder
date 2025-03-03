import { JwtService } from '@nestjs/jwt';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUsersDto } from './dto/create-user.dto';
import { UpdateUsersDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from './entities/users.entity';
import * as argon2 from 'argon2'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users) private readonly usersRepository: Repository<Users>,
    private readonly jwtService:JwtService, 
  ){}

  async create(createUserDto: CreateUsersDto) {
    const existUser = await this.usersRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });
    if (existUser) throw new BadRequestException('Данная почта уже зарегистрирована!');
  
    const hashedPassword = await argon2.hash(createUserDto.password);
  
    const user = this.usersRepository.create({
      first_name: createUserDto.first_name,
      last_name: createUserDto.last_name,
      email: createUserDto.email,
      password: hashedPassword,
      date_of_birth: createUserDto.date_of_birth, 
      phone: createUserDto.phone, 
      isActivated: createUserDto.isActivated,
    });
  
    await this.usersRepository.save(user);
  
    const token = this.jwtService.sign({ email: createUserDto.email });
  
    return { user, token };
  }
  

  findAll() {
    return this.usersRepository.find();
  }

  async findOne(email: string) {
    console.log(email)
    const user = await this.usersRepository.findOne({
      where: { email: email.toLowerCase() },
    });
    
    console.log(user, "fdklsjflksd")
    if (!user) {
      throw new BadRequestException('Пользователь с таким email не найден2222!');
    }
  
    return user;
  }
  async findById(id: number) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }
    return user;
  }

  update(id: number, updateUsersDto: UpdateUsersDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: number) {
    const user = await this.usersRepository.findOne({ where: { id } });
  
    if (!user) {
      throw new BadRequestException('Пользователь с таким ID не найден!');
    }
  
    await this.usersRepository.remove(user);
  
    return { message: `Пользователь с ID ${id} успешно удалён.` };
  }
}
