/* eslint-disable @typescript-eslint/no-var-requires */
import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { ExpressAdapter } from "@nestjs/platform-express";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "../src/app.module";
import { GlobalHttpExceptionFilter } from "../src/common/filters/http-exception.filter";

// Use require() for CJS modules to avoid ESM default-import issues on Vercel
const express    = require("express");
const helmet     = require("helmet");
const compression = require("compression");
const cookieParser = require("cookie-parser");

const server = express();
const adapter = new ExpressAdapter(server);

let cachedApp: any;

async function bootstrap() {
  if (cachedApp) return cachedApp;

  const app = await NestFactory.create(AppModule, adapter, { logger: false });

  app.use(helmet.default ? helmet.default({ contentSecurityPolicy: false }) : helmet({ contentSecurityPolicy: false }));
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
