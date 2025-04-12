import { IsBoolean, IsOptional } from "class-validator";

export class UpdateTaskDto {
  @IsOptional()
  @IsBoolean()
  completed?: boolean;

  @IsOptional()
  title?: string;
}
