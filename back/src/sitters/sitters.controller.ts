import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe } from '@nestjs/common';
import { SittersService } from './sitters.service';
import { CreateSitterDto } from './dto/create-sitter.dto';
import { UpdateSitterDto } from './dto/update-sitter.dto';

@Controller('sitters')
export class SittersController {
  constructor(private readonly sittersService: SittersService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  create(@Body() createSitterDto: CreateSitterDto) {
    return this.sittersService.create(createSitterDto);
  }

  @Get()
  findAll() {
    return this.sittersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sittersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSitterDto: UpdateSitterDto) {
    return this.sittersService.update(+id, updateSitterDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sittersService.remove(+id);
  }
}
