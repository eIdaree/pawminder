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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUsersDto } from './dto/create-user.dto';
import { UpdateUsersDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  create(@Body() createUsersDto: CreateUsersDto) {
    console.log(createUsersDto);
    return this.userService.create(createUsersDto);
  }

  @Get('/all')
  findAll() {
    return this.userService.findAll();
  }
  @Get('/me')
  @UseGuards(JwtAuthGuard)
  async findMe(@Request() req) {
    console.log('User:', req.user);
    const { email } = req.user;
    console.log(email);
    return this.userService.findOne(email);
  }
  @Get(':email')
  findOne(@Param('email') email: string) {
    console.log('lksdjflksdjflksjdcklsdnlc');

    return this.userService.findOne(email);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUserData(@Request() req) {
    const user = req.user;
    return user;
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe())
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUsersDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }
}

export { UsersService };
