import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PetsModule } from "./pets/pets.module";
import { UsersModule } from "./users/users.module";
import { ArticlesModule } from "./articles/articles.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import { TasksModule } from "./tasks/tasks.module";
import { UploadModule } from "./upload/upload.module";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { OrdersModule } from "./orders/orders.module";
import { TransactionsModule } from "./transactions/transactions.module";
import { NotesModule } from "./notes/notes.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [
        ConfigModule,
        ServeStaticModule.forRoot(
          {
            rootPath: join(__dirname, "..", "pet"),
            serveRoot: "/api/pet",
          },
          {
            rootPath: join(__dirname, "..", "avatars"),
            serveRoot: "/api/avatars",
          },
          {
            rootPath: join(__dirname, "..", "certificate"),
            serveRoot: "/api/certificate",
          },
        ),
      ],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        host: configService.get("DB_HOST"),
        port: configService.get("DB_PORT"),
        username: configService.get("DB_USERNAME"),
        password: configService.get("DB_PASSWORD"),
        database: configService.get("DB_NAME"),
        synchronize: true,
        entities: [__dirname + "/**/*.entity{.js,.ts}"],
      }),
      inject: [ConfigService],
    }),
    PetsModule,
    UsersModule,
    ArticlesModule,
    AuthModule,
    TasksModule,
    UploadModule,
    OrdersModule,
    TransactionsModule,
    NotesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
