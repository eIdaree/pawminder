import { IsString, IsOptional, IsDateString, IsNumber } from 'class-validator';

export class CreatePetDto {
  @IsString()
  name: string;

  @IsString()
  species: string;

  @IsNumber()
  weight: number;

  @IsOptional()
  @IsString()
  breed?: string;

  @IsDateString()
  date_of_birth: string;
}
