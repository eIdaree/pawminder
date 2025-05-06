import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';
import { Sitter } from '../sitters/entities/sitter.entity';
import { CreateSitterDto } from './dto/create-sitter.dto';
import { UpdateSitterDto } from './dto/update-sitter.dto';
import { Users } from '../users/entities/users.entity';

@Injectable()
export class SittersService {
  constructor(
    @InjectRepository(Sitter)
    private readonly sittersRepository: Repository<Sitter>,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  async create(dto: CreateSitterDto): Promise<Sitter> {
    const { email, phone, password } = dto;

    const existingSitter = await this.sittersRepository.findOne({ where: [{ email }, { phone }] });
    if (existingSitter) {
      throw new ConflictException('Email or phone number already exists');
    }

    const hashedPassword = await argon2.hash(password);
    const sitter = this.sittersRepository.create({ ...dto, password: hashedPassword });
    return this.sittersRepository.save(sitter);
  }

  async assignSitterToUser(userId: number, sitterId: number): Promise<Users> {
    const user = await this.usersRepository.findOne({ where: { id: userId }, relations: ['sitter'] });
    const sitter = await this.sittersRepository.findOne({ where: { id: sitterId } });

    if (!user || !sitter) {
      throw new ConflictException('User or sitter not found');
    }

    user.sitter = sitter;
    return this.usersRepository.save(user);
  }

  findAll() {
    return `This action returns all sitters`;
  }

  findOne(id: number) {
    return `This action returns a #${id} sitter`;
  }

  update(id: number, updateSitterDto: UpdateSitterDto) {
    return `This action updates a #${id} sitter`;
  }

  remove(id: number) {
    return `This action removes a #${id} sitter`;
  }
}
