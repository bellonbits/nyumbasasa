import { Module } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";
import { memoryStorage } from "multer";
import { ListingsController } from "./listings.controller";
import { ListingsService } from "./listings.service";
import { CloudinaryModule } from "../cloudinary/cloudinary.module";

@Module({
  imports: [
    CloudinaryModule,
    MulterModule.register({ storage: memoryStorage(), limits: { fileSize: 5_242_880 } }), // 5MB
  ],
  controllers: [ListingsController],
  providers:   [ListingsService],
  exports:     [ListingsService],
})
export class ListingsModule {}
