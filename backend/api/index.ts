import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { ExpressAdapter } from "@nestjs/platform-express";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "../src/app.module";
import { GlobalHttpExceptionFilter } from "../src/common/filters/http-exception.filter";

// Safe CJS interop — works with tsc, webpack (ncc), and esbuild
// eslint-disable-next-line @typescript-eslint/no-require-imports
const expressModule = require("express");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const helmetModule = require("helmet");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const compressionModule = require("compression");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const cookieParserModule = require("cookie-parser");

// Handle both raw CJS export (express()) and wrapped ESM default (.default())
const createApp   = typeof expressModule === "function" ? expressModule : expressModule.default;
const helmetFn    = typeof helmetModule === "function"  ? helmetModule  : helmetModule.default;
const compressFn  = typeof compressionModule === "function" ? compressionModule : compressionModule.default;
const cookieFn    = typeof cookieParserModule === "function" ? cookieParserModule : cookieParserModule.default;

const server  = createApp();
const adapter = new ExpressAdapter(server);

let cachedApp: any;

async function bootstrap() {
  if (cachedApp) return cachedApp;

  const app = await NestFactory.create(AppModule, adapter, { logger: false });

  app.use(helmetFn({ contentSecurityPolicy: false }));
  app.use(compressFn());
  app.use(cookieFn());

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
