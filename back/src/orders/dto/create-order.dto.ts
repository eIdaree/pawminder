import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";
import { OrderStatus } from "../entities/order.entity";

export class CreateOrderDto {
  @IsNumber()
  sitterId: number;

  @IsNumber()
  ownerId: number;

  @IsNumber()
  petId: number;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsString()
  careTime: string;

  @IsArray()
  @IsString({ each: true })
  services: string[];

  @IsNumber()
  fee: number;

  @IsOptional()
  @IsEnum(["pending", "accepted", "completed", "rejected"])
  status?: OrderStatus;
}
