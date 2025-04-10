import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from "@nestjs/common";
import { OrdersService } from "./orders.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";

@Controller("orders")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req, @Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto, req.user);
  }

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  getMyOrders(@Request() req) {
    return this.ordersService.findForUser(req.user.id);
  }

  @Get("assigned")
  @UseGuards(JwtAuthGuard)
  getAssignedOrders(@Request() req) {
    return this.ordersService.findForSitter(req.user.id);
  }
  @Get("reviews/:sitterId")
  findReviews(@Param("sitterId") sitterId: number) {
    return this.ordersService.findReviewsBySitter(+sitterId);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.ordersService.findOne(+id);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  update(@Param("id") id: string, @Body() dto: UpdateOrderDto, @Request() req) {
    return this.ordersService.update(+id, dto, req.user.id);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  remove(@Param("id") id: string, @Request() req) {
    return this.ordersService.remove(+id, req.user.id);
  }
}
