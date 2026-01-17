import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { appConfig } from 'src/config/app.config';

type ErrorResponse = {
  statusCode: number;
  timestamp: string;
  path: string;
  method: string;
  message: string | string[];
  error?: string;
  stack?: string;
};

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const errorResponse = this.buildErrorResponse(exception, request);

    // Log error
    this.logError(exception, request, errorResponse);

    response.status(errorResponse.statusCode).json(errorResponse);
  }

  private buildErrorResponse(
    exception: unknown,
    request: Request,
  ): ErrorResponse {
    const timestamp = new Date().toISOString();
    const path = request.url;
    const method = request.method;

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      let message: string | string[];
      if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null &&
        'message' in exceptionResponse
      ) {
        const responseWithMessage = exceptionResponse as {
          message: string | string[];
        };
        message = responseWithMessage.message;
      } else {
        message = exception.message;
      }

      return {
        statusCode: status,
        timestamp,
        path,
        method,
        message,
        error: exception.name,
      };
    }

    // Unknown error
    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      timestamp,
      path,
      method,
      message: 'Internal server error',
      error: 'InternalServerError',
      stack: appConfig.showErrorStack ? (exception as Error).stack : undefined,
    };
  }

  private logError(
    exception: unknown,
    request: Request,
    errorResponse: ErrorResponse,
  ): void {
    const { method, url } = request;
    const body = request.body as unknown;
    const params = request.params as unknown;
    const query = request.query as unknown;

    const logMessage = {
      message: 'HTTP Exception',
      method,
      url,
      body,
      params,
      query,
      error: errorResponse,
      stack: exception instanceof Error ? exception.stack : undefined,
    };

    if (errorResponse.statusCode >= 500) {
      this.logger.error(JSON.stringify(logMessage));
    } else {
      this.logger.warn(JSON.stringify(logMessage));
    }
  }
}
