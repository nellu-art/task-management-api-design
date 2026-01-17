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

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const { method, url, body, params, query } = request;
    const userAgent = request.get('user-agent') || '';
    const ip = request.ip;

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
        next: (data) => {
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
        error: (error) => {
          const responseTime = Date.now() - now;
          this.logger.error({
            message: 'Request Failed',
            method,
            url,
            responseTime: `${responseTime}ms`,
            error: error.message,
          });
        },
      }),
    );
  }
}
