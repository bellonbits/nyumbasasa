import { NestFactory } from "@nestjs/core";
import { ValidationPipe, Logger } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import helmet from "helmet";
import * as compression from "compression";
import * as cookieParser from "cookie-parser";
import { AppModule } from "./app.module";
import { GlobalHttpExceptionFilter } from "./common/filters/http-exception.filter";

async function bootstrap() {
  const app    = await NestFactory.create(AppModule);
  const logger = new Logger("Bootstrap");

  // ── Security ───────────────────────────────────────────────────────────────
  app.use(helmet());
  app.use(compression());
  app.use(cookieParser());

  // ── CORS ───────────────────────────────────────────────────────────────────
  app.enableCors({
    origin:      process.env.FRONTEND_URL ?? "http://localhost:3000",
    credentials: true,
  });

  // ── Global prefix ──────────────────────────────────────────────────────────
  app.setGlobalPrefix("api");

  // ── Validation ─────────────────────────────────────────────────────────────
  app.useGlobalPipes(new ValidationPipe({
    whitelist:        true,
    forbidNonWhitelisted: true,
    transform:        true,
    transformOptions: { enableImplicitConversion: true },
  }));

  // ── Error handling ─────────────────────────────────────────────────────────
  app.useGlobalFilters(new GlobalHttpExceptionFilter());

  // ── Swagger (disabled in prod) ─────────────────────────────────────────────
  if (process.env.NODE_ENV !== "production") {
    const config = new DocumentBuilder()
      .setTitle("NyumbaSasa API")
      .setDescription("Kenyan Rental Marketplace REST API")
      .setVersion("1.0")
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api/docs", app, document);
    logger.log("Swagger docs available at /api/docs");
  }

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  logger.log(`🏠 NyumbaSasa API running on http://localhost:${port}/api`);
}

bootstrap();
