import {
  ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger,
} from "@nestjs/common";
import { Request, Response } from "express";

@Catch()
export class GlobalHttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalHttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx      = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request  = ctx.getRequest<Request>();

    let status  = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = "Internal server error";
    let errors: string[] | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const body = exception.getResponse();
      if (typeof body === "string") {
        message = body;
      } else if (typeof body === "object" && body !== null) {
        message = (body as any).message ?? message;
        if (Array.isArray((body as any).message)) {
          errors  = (body as any).message;
          message = "Validation failed";
        }
      }
    } else {
      this.logger.error("Unhandled exception", exception);
    }

    response.status(status).json({
      success:   false,
      statusCode: status,
      message,
      errors,
      timestamp: new Date().toISOString(),
      path:      request.url,
    });
  }
}
