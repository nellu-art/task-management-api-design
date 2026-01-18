import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AppConfig } from './config/app.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove properties that are not in the DTO
      forbidNonWhitelisted: true, // Throw an error if a property that is not in the DTO is sent
      transform: true, // Transform the payload to the DTO type
      transformOptions: {
        enableImplicitConversion: true, // Enable implicit conversion of payload to DTO type
      },
    }),
  );

  // Swagger/OpenAPI configuration
  const config = new DocumentBuilder()
    .setTitle('Tasks API')
    .setDescription(
      'A RESTful API for managing tasks, built with NestJS following clean architecture principles.',
    )
    .setVersion('1.0')
    .addTag('tasks', 'Task management endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const configService = app.get(ConfigService);
  const appConfig = configService.get<AppConfig>('app');
  if (!appConfig) {
    logger.error('App configuration not found');
    throw new Error('App configuration not found');
  }
  const port = appConfig.port;

  await app.listen(port);

  logger.log(`🚀 Application is running on: http://localhost:${port}`);
  logger.log(`📝 Environment: ${appConfig.env}`);
  logger.log(
    `📚 Swagger documentation available at: http://localhost:${port}/api`,
  );
}

bootstrap().catch((error) => {
  // Use console.error as fallback since Logger might not be available
  // if bootstrap fails before app creation

  console.error('Failed to start application:', error);
  process.exit(1);
});
