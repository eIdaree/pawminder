import { IsString, IsOptional, IsDateString, IsNumber } from "class-validator";

export class CreatePetDto {
  @IsString()
  name: string;

  @IsString()
  species: string;

  @IsNumber()
  weight: number;

  @IsString()
  color: string;

  @IsString()
  gender: string;

  @IsString()
  activity: string;

  @IsString()
  character: string;

  @IsOptional()
  @IsString()
  breed?: string;

  @IsDateString()
  date_of_birth: string;

  @IsOptional()
  @IsString()
  photo?: string;
}
