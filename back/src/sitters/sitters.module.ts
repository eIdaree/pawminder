import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SittersService } from './sitters.service';
import { SittersController } from './sitters.controller';
import { Sitter } from './entities/sitter.entity';
import { Users } from 'src/users/entities/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sitter, Users])], 
  controllers: [SittersController],
  providers: [SittersService],
  exports: [SittersService], 
})
export class SittersModule {}
