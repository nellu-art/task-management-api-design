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
    const body = request.body as unknown;
    const params = request.params as unknown;
    const query = request.query as unknown;
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
          this.logger.log({
            message: 'Outgoing Response',
            method,
            url,
            statusCode: response.statusCode,
            responseTime: `${responseTime}ms`,
            dataSize: JSON.stringify(data).length,
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
