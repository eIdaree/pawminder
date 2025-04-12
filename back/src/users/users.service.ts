import { JwtService } from "@nestjs/jwt";
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateUsersDto } from "./dto/create-user.dto";
import { UpdateUsersDto } from "./dto/update-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Role, Users, VerificationStatus } from "./entities/users.entity";
import * as argon2 from "argon2";
import { FindSittersDto } from "./dto/find-sitters.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUsersDto) {
    const existUser = await this.usersRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });
    if (existUser)
      throw new BadRequestException("Данная почта уже зарегистрирована!");

    const hashedPassword = await argon2.hash(createUserDto.password);

    const user = this.usersRepository.create({
      first_name: createUserDto.first_name,
      last_name: createUserDto.last_name,
      email: createUserDto.email,
      password: hashedPassword,
      date_of_birth: createUserDto.date_of_birth,
      phone: createUserDto.phone,
      isActivated: createUserDto.isActivated,
      role: createUserDto.role,
    });

    await this.usersRepository.save(user);

    const token = this.jwtService.sign({ email: createUserDto.email });
    console.log("Saved user", user);
    return { user, token };
  }

  findAll() {
    return this.usersRepository.find();
  }

  async findOne(email: string) {
    console.log("EMAIL", email);
    const user = await this.usersRepository.findOne({
      where: { email: email.toLowerCase() },
    });

    console.log(user, "fdklsjflksd");
    if (!user) {
      throw new BadRequestException(
        "Пользователь с таким email не найден2222!",
      );
    }

    return user;
  }
  async findById(id: number) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException("Пользователь не найден");
    }
    return user;
  }
  async getPendingVerificationUsers() {
    return this.usersRepository.find({
      where: {
        verificationStatus: VerificationStatus.PENDING,
        role: Role.SITTER,
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        phone: true,
        description: true,
        certificateUrl: true,
        location: true,
        verificationStatus: true,
      },
    });
  }
  async findSitters(filters: FindSittersDto) {
    const query = this.usersRepository.createQueryBuilder("user");

    query.where("user.role = :role", { role: Role.SITTER });
    query.andWhere("user.verificationStatus = :status", {
      status: VerificationStatus.VERIFIED,
    });

    if (filters.location) {
      query.andWhere("user.location ILIKE :location", {
        location: `%${filters.location}%`,
      });
    }

    if (filters.skills?.length) {
      query.andWhere("user.skills && :skills", {
        skills: filters.skills,
      });
    }

    if (filters.petTypes?.length) {
      query.andWhere("user.petTypes && :petTypes", {
        petTypes: filters.petTypes,
      });
    }

    query.orderBy("user.completedOrdersCount", "DESC");

    return await query.getMany();
  }
  async getBalanceWithTransactions(userId: number) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ["transactions"],
    });

    if (!user) throw new NotFoundException("User not found");

    return {
      balance: user.balance,
      transactions: user.transactions || [],
    };
  }

  async topUpBalance(userId: number, amount: number): Promise<Users> {
    if (amount <= 0) {
      throw new BadRequestException("Invalid top-up amount");
    }

    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException("User not found");
    }

    user.balance += amount;
    return this.usersRepository.save(user);
  }

  async update(id: number, updateUserDto: UpdateUsersDto) {
    await this.usersRepository.update(id, updateUserDto);
    const updatedUser = await this.usersRepository.findOne({ where: { id } });
    return updatedUser;
  }

  async remove(id: number) {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new BadRequestException("Пользователь с таким ID не найден!");
    }

    await this.usersRepository.remove(user);

    return { message: `Пользователь с ID ${id} успешно удалён.` };
  }
}
