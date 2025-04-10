import { Module } from "@nestjs/common";
import { UploadService } from "./upload.service";
import { UploadController } from "./upload.controller";
import { PetsModule } from "src/pets/pets.module";
import { UsersModule } from "src/users/users.module";

@Module({
  imports: [PetsModule, UsersModule],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
