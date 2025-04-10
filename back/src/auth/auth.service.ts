import { UsersService } from "../users/users.controller";
import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateAuthDto } from "./dto/create-auth.dto";
import { UpdateAuthDto } from "./dto/update-auth.dto";
import * as argon2 from "argon2";
import { JwtService } from "@nestjs/jwt";
import { IUser } from "src/types/types";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findOne(email);
    const passwordMatch = await argon2.verify(user.password, password);

    if (user && passwordMatch) {
      return user;
    }
    throw new BadRequestException(" Почта или пароль неверный");
  }
  async login(user: IUser) {
    const { id, email } = user;
    return {
      id,
      email,
      token: this.jwtService.sign({
        id: user.id,
        email: user.email,
        password: user.password,
      }),
    };
  }
}
