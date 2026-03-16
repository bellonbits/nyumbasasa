import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { ExpressAdapter } from "@nestjs/platform-express";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "../src/app.module";
import { GlobalHttpExceptionFilter } from "../src/common/filters/http-exception.filter";
import helmet from "helmet";
import * as compression from "compression";
import * as cookieParser from "cookie-parser";
import * as express from "express";
import type { Express } from "express";

const server: Express = express();
const adapter = new ExpressAdapter(server);

let cachedApp: any;

async function bootstrap() {
  if (cachedApp) return cachedApp;

  const app = await NestFactory.create(AppModule, adapter, { logger: false });

  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(compression());
  app.use(cookieParser());

  app.enableCors({
    origin: process.env.FRONTEND_URL ?? "*",
    credentials: true,
  });

  app.setGlobalPrefix("api");

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    })
  );

  app.useGlobalFilters(new GlobalHttpExceptionFilter());

  await app.init();
  cachedApp = app;
  return cachedApp;
}

export default async function handler(req: any, res: any) {
  await bootstrap();
  server(req, res);
}
