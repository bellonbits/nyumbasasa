import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { v2 as cloudinary, UploadApiResponse, UploadApiOptions } from "cloudinary";
import { Readable } from "stream";

@Injectable()
export class CloudinaryService {
  constructor(config: ConfigService) {
    cloudinary.config({
      cloud_name: config.get("CLOUDINARY_CLOUD_NAME"),
      api_key:    config.get("CLOUDINARY_API_KEY"),
      api_secret: config.get("CLOUDINARY_API_SECRET"),
    });
  }

  upload(file: Express.Multer.File, options: UploadApiOptions = {}): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        {
          resource_type: "image",
          transformation: [
            { width: 1200, height: 900, crop: "limit" },
            { quality: "auto:good" },
            { format: "webp" },
          ],
          ...options,
        },
        (err, result) => {
          if (err || !result) reject(err ?? new Error("Upload failed"));
          else resolve(result);
        }
      );
      const stream = Readable.from(file.buffer);
      stream.pipe(upload);
    });
  }

  async destroy(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId);
  }
}
