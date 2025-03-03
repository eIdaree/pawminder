import { IsBoolean, IsDateString, IsEmail, IsNotEmpty, IsPhoneNumber, IsString, Min, MinLength } from "class-validator";

export class CreateUsersDto {
    @IsNotEmpty()
    @IsString()
    first_name: string;

    @IsNotEmpty()
    @IsString()
    last_name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MinLength(8)
    @IsString()
    password: string;

    @IsNotEmpty()
    @IsDateString()
    date_of_birth: string;

    @IsNotEmpty()
    @IsPhoneNumber('KZ')
    phone: string;

    @IsBoolean()
    isActivated: boolean;
}
