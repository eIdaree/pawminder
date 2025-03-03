import { Controller, Post, Body, Get, Param, Patch, Delete, UsePipes, ValidationPipe, UseGuards, Request } from '@nestjs/common';
import { PetsService } from './pets.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('pets')
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @Post(':userId')
  @UsePipes(new ValidationPipe())
  create(@Param('userId') userId: number, @Body() createPetDto: CreatePetDto) {
    return this.petsService.create(userId, createPetDto);
  }

  @Get(':userId')
  async findAll(@Param('userId') userId: number) {
    return this.petsService.findAllByUserId(userId);
  }

  @Get(':userId/:id')
  async findOne(@Param('userId') userId: number, @Param('id') id: number) {
    return this.petsService.findOneByUserId(userId, id);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard('jwt'))
  update(
    @Param('id') id: number,
    @Request() req,
    @Body() updatePetDto: UpdatePetDto
  ) {
    const userId = req.user.id; 
    return this.petsService.update(userId, id, updatePetDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt')) 
  async remove(
    @Param('id') id: number, 
    @Request() req
  ) {
    const userId = req.user.id; 
    return this.petsService.remove(userId, id); 
  }
}
