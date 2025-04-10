import { Injectable, BadRequestException } from "@nestjs/common";
import { extname } from "path";
import * as fs from "fs";

@Injectable()
export class UploadService {
  private readonly rootPath = "./"; // корень, где все папки

  saveFile(file: Express.Multer.File, folder: string = "uploads"): string {
    if (!file) {
      throw new BadRequestException("File is required");
    }

    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename = uniqueSuffix + extname(file.originalname);

    const targetFolder = `${this.rootPath}${folder}`;

    // Создаём папку, если не существует
    if (!fs.existsSync(targetFolder)) {
      fs.mkdirSync(targetFolder, { recursive: true });
    }

    const filePath = `${targetFolder}/${filename}`;
    fs.writeFileSync(filePath, file.buffer);

    return filename;
  }

  deleteFile(filename: string, folder: string = "uploads") {
    const filePath = `${this.rootPath}${folder}/${filename}`;
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}
