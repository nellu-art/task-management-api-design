import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const { method, url, ip } = request;
    const body = request.body as Record<string, unknown>;
    const params = request.params as Record<string, string>;
    const query = request.query as Record<string, string | string[]>;
    const userAgent = request.get('user-agent') || '';

    const now = Date.now();

    this.logger.log({
      message: 'Incoming Request',
      method,
      url,
      body,
      params,
      query,
      userAgent,
      ip,
    });

    return next.handle().pipe(
      tap({
        next: (data: unknown) => {
          const responseTime = Date.now() - now;
          const dataSize =
            data !== undefined && data !== null
              ? JSON.stringify(data).length
              : 0;
          this.logger.log({
            message: 'Outgoing Response',
            method,
            url,
            statusCode: response.statusCode,
            responseTime: `${responseTime}ms`,
            dataSize,
          });
        },
        error: (error: unknown) => {
          const responseTime = Date.now() - now;
          const errorMessage =
            error instanceof Error ? error.message : 'Unknown error';
          this.logger.error({
            message: 'Request Failed',
            method,
            url,
            responseTime: `${responseTime}ms`,
            error: errorMessage,
          });
        },
      }),
    );
  }
}
