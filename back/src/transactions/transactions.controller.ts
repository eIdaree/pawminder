// src/transactions/transactions.controller.ts
import { Controller, Get, UseGuards, Req } from "@nestjs/common";
import { TransactionsService } from "./transactions.service";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";

@Controller("transactions")
@UseGuards(JwtAuthGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get("me")
  async getMyTransactions(@Req() req) {
    return this.transactionsService.findByUser(req.user.id);
  }
}
