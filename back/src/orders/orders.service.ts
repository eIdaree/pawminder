import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IsNull, Not, Repository } from "typeorm";
import { Order } from "./entities/order.entity";
import { Users } from "../users/entities/users.entity";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { Pet } from "src/pets/entities/pet.entity";
import { OrderStatus } from "./entities/order.entity";

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,

    @InjectRepository(Pet)
    private petsRepository: Repository<Pet>,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  async create(
    createOrderDto: CreateOrderDto,
    currentUser: Users,
  ): Promise<Order> {
    const { sitterId, ownerId, petId, ...rest } = createOrderDto;

    if (currentUser.id !== ownerId) {
      throw new UnauthorizedException(
        "Вы не можете делать заказ от имени другого пользователя.",
      );
    }

    const sitter = await this.usersRepository.findOne({
      where: { id: sitterId },
    });
    const user = await this.usersRepository.findOne({ where: { id: ownerId } });
    const pet = await this.petsRepository.findOne({
      where: { id: petId },
      relations: ["user"],
    });

    if (!sitter || !user || !pet) {
      throw new NotFoundException("Sitter, user, or pet not found");
    }

    if (pet.user.id !== currentUser.id) {
      throw new UnauthorizedException(
        "Вы можете заказывать только для своих питомцев",
      );
    }

    const order = this.ordersRepository.create({
      ...rest,
      sitter,
      user,
      pet,
    });

    return this.ordersRepository.save(order);
  }

  findAll(): Promise<Order[]> {
    return this.ordersRepository.find();
  }

  findOne(id: number): Promise<Order> {
    return this.ordersRepository.findOne({ where: { id } });
  }
  async findForSitter(userId: number): Promise<Order[]> {
    return this.ordersRepository.find({
      where: {
        sitter: { id: userId },
      },
      relations: ["user", "pet"],
      order: { createdAt: "DESC" },
    });
  }

  async findForUser(userId: number): Promise<Order[]> {
    return this.ordersRepository.find({
      where: {
        user: { id: userId },
      },
      relations: ["sitter", "pet"],
      order: { createdAt: "DESC" },
    });
  }
  async findReviewsBySitter(sitterId: number): Promise<Order[]> {
    return this.ordersRepository.find({
      where: {
        sitter: { id: sitterId },
        status: OrderStatus.COMPLETED,
        rating: Not(IsNull()),
      },
      relations: ["user"], // чтобы получить имя того, кто оставил отзыв
      order: { updatedAt: "DESC" },
    });
  }

  async update(
    id: number,
    dto: UpdateOrderDto,
    userId: number,
  ): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ["user", "sitter"],
    });

    if (!order) throw new NotFoundException("Order not found");

    const isOwner = order.user.id === userId;
    const isSitter = order.sitter.id === userId;

    if (isOwner) {
      // 🔒 Только если заказ завершён — можно ставить рейтинг и отзыв
      if (dto.rating !== undefined || dto.review !== undefined) {
        if (order.status !== OrderStatus.COMPLETED) {
          throw new ForbiddenException(
            "You can rate and review only after order is completed",
          );
        }
      }

      if (dto.status && dto.status !== OrderStatus.COMPLETED) {
        throw new ForbiddenException("Owner can only complete the order");
      }

      if (dto.status === OrderStatus.COMPLETED) {
        const fee = order.fee;
        const commission = Math.floor(fee * 0.1);
        const sitterShare = fee - commission;

        if (order.user.balance < fee) {
          throw new BadRequestException(
            "Not enough balance to complete the order",
          );
        }

        // 💸 Списание с владельца
        order.user.balance -= fee;

        // 💸 Начисление няне
        order.sitter.balance += sitterShare;

        // 💼 Устанавливаем комиссию
        order.platformCommission = commission;
        order.status = OrderStatus.COMPLETED;
      }

      if (dto.rating !== undefined) order.rating = dto.rating;
      if (dto.review !== undefined) order.review = dto.review;
    } else if (isSitter) {
      if (
        dto.status !== OrderStatus.ACCEPTED &&
        dto.status !== OrderStatus.REJECTED
      ) {
        throw new ForbiddenException(
          "Sitter can only accept or reject the order",
        );
      }
      order.status = dto.status;
    } else {
      throw new ForbiddenException("Access denied");
    }

    return this.ordersRepository.save(order);
  }

  async remove(id: number, userId: number) {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ["user", "sitter"],
    });

    if (!order) throw new NotFoundException("Order not found");
    if (order.user.id !== userId) throw new ForbiddenException("Access denied");

    return this.ordersRepository.remove(order);
  }
}
