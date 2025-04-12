import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateTransactionDto {
  @IsNumber()
  amount: number;

  @IsEnum(["income", "expense"])
  type: "income" | "expense";

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  userId: number;
}
