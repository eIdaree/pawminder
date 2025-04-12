import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transaction } from "./entities/transaction.entity";
import { Users } from "src/users/entities/users.entity";

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepo: Repository<Transaction>,

    @InjectRepository(Users)
    private usersRepo: Repository<Users>,
  ) {}

  async create(
    user: Users,
    amount: number,
    type: "income" | "expense",
    description: string,
  ): Promise<Transaction> {
    const transaction = this.transactionRepo.create({
      user,
      amount,
      type,
      description,
    });

    return this.transactionRepo.save(transaction);
  }

  async findByUser(userId: number): Promise<Transaction[]> {
    return this.transactionRepo.find({
      where: { user: { id: userId } },
      order: { createdAt: "DESC" },
    });
  }
}
