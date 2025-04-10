import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
  UseGuards,
  Request,
  Query,
  UnauthorizedException,
  Req,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUsersDto } from "./dto/create-user.dto";
import { UpdateUsersDto } from "./dto/update-user.dto";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { VerificationStatus } from "./entities/users.entity";
import { FindSittersDto } from "./dto/find-sitters.dto";

@Controller("users")
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  create(@Body() createUsersDto: CreateUsersDto) {
    console.log("Creating user", createUsersDto);
    return this.userService.create(createUsersDto);
  }

  @Get("/all")
  findAll() {
    return this.userService.findAll();
  }
  @Get("/me")
  @UseGuards(JwtAuthGuard)
  async findMe(@Request() req) {
    console.log("User:", req.user);
    const { email } = req.user;
    console.log(email);
    return this.userService.findOne(email);
  }
  @Patch("me/top-up")
  @UseGuards(JwtAuthGuard)
  async topUp(@Body("amount") amount: number, @Request() req) {
    const userId = req.user?.id;

    if (!userId) {
      throw new UnauthorizedException("User not found in request");
    }

    return this.userService.topUpBalance(userId, amount);
  }
  @Get("me/balance")
  @UseGuards(JwtAuthGuard)
  async getMyBalance(@Request() req) {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedException("User not found in request");
    }
    return this.userService.getBalance(userId);
  }

  @Get("sitters")
  findSitters(@Query() query: any) {
    const filters: FindSittersDto = {
      location: query.location || "",
      petTypes: query.petTypes ? query.petTypes.split(",") : [],
      skills: query.skills ? query.skills.split(",") : [],
    };
    console.log("Filters", filters);
    return this.userService.findSitters(filters);
  }
  @Get("verification/pending")
  getPendingVerificationUsers() {
    return this.userService.getPendingVerificationUsers();
  }
  @Get(":email")
  findOne(@Param("email") email: string) {
    console.log("lksdjflksdjflksjdcklsdnlc");

    return this.userService.findOne(email);
  }
  @Get()
  @UseGuards(JwtAuthGuard)
  async getUserData(@Request() req) {
    const user = req.user;
    return user;
  }

  @Patch(":id/verify")
  updateVerificationStatus(
    @Param("id", ParseIntPipe) id: number,
    @Body("verificationStatus") status: VerificationStatus,
  ) {
    return this.userService.update(id, { verificationStatus: status });
  }

  @Patch(":id")
  @UsePipes(new ValidationPipe())
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUsersDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }
}

export { UsersService };
