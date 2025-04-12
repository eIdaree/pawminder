import {
  IsString,
  IsOptional,
  IsDateString,
  IsNumber,
  IsArray,
  ArrayMinSize,
} from "class-validator";

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

  // Множественный выбор: не менее одного значения
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1, { message: "Choose at least one activity" })
  activity: string[];

  // Множественный выбор: не менее одного значения
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1, { message: "Choose at least one personality trait" })
  character: string[];

  @IsOptional()
  @IsString()
  breed?: string;

  @IsDateString()
  date_of_birth: string;

  @IsOptional()
  @IsString()
  photo?: string;

  @IsOptional()
  @IsString()
  petDescription?: string;

  @IsOptional()
  @IsString()
  additionalNotes?: string;
}
