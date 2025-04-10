import { UsersService } from "./../users/users.service";
import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Param,
  Put,
  BadRequestException,
  Req,
  ForbiddenException,
  UseGuards,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { UploadService } from "./upload.service";
import { PetsService } from "src/pets/pets.service";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { ParseIntPipe } from "@nestjs/common";

@Controller("upload")
export class UploadController {
  constructor(
    private readonly petService: PetsService,
    private readonly uploadService: UploadService,
    private readonly usersService: UsersService,
  ) {}

  @Post(":petId")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor("file"))
  async uploadFile(
    @Param("petId", ParseIntPipe) petId: number,
    @Req() req,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException("File is required");
    }
    console.log("File uploaded:", file);
    console.log("File name:", file.filename);
    console.log("petId:", petId);

    const userId = req.user.id;

    const pet = await this.petService.findOne(petId);
    console.log("222");
    if (!pet) {
      throw new BadRequestException("Pet not found");
    }
    console.log("333", pet, userId);

    if (pet.user.id !== userId) {
      throw new ForbiddenException(
        "You do not have permission to edit this pet",
      );
    }
    console.log("444");
    // Удаляем старое фото, если оно есть
    if (pet.photo) {
      this.uploadService.deleteFile(pet.photo);
    }
    console.log("555");
    // Сохраняем новое фото
    const filename = this.uploadService.saveFile(file, "pet");
    console.log("666");
    // Обновляем фото питомца
    await this.petService.update(userId, petId, { photo: filename });
    console.log("777");
    return {
      message: "Photo updated successfully",
      filename,
      path: `/uploads/${filename}`,
    };
  }

  @Post("certificate/:userId")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor("file"))
  async uploadCertificate(
    @Param("userId", ParseIntPipe) userId: number,
    @Req() req,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException("Сертификат обязателен");
    }

    if (userId !== req.user.id) {
      throw new ForbiddenException("Нет доступа к загрузке сертификата");
    }

    const filename = this.uploadService.saveFile(file, "certificate"); // передаем папку
    // Здесь можно обновить профиль пользователя, например, добавить путь к сертификату:
    await this.usersService.update(userId, { certificateUrl: filename });

    return {
      message: "Сертификат успешно загружен",
      path: `/certificate/${filename}`,
    };
  }
  @Post("avatar/:userId")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor("file"))
  async uploadUserAvatar(
    @Param("userId", ParseIntPipe) userId: number,
    @Req() req,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException("Фото обязательно");
    }

    if (userId !== req.user.id) {
      throw new ForbiddenException("Нет доступа к загрузке фото");
    }

    const filename = this.uploadService.saveFile(file, "avatars"); // сохраним в папку avatars
    await this.usersService.update(userId, { avatarUrl: filename });

    return {
      message: "Фото успешно загружено",
      path: `/avatars/${filename}`,
    };
  }
}
