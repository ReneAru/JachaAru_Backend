import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');
  
  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  
  // Global exception filter
  app.useGlobalFilters(new AllExceptionsFilter());
  
  // Enable CORS for development
  app.enableCors();
  
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  
  logger.log(`🚀 Jacha Aru API is running on: http://localhost:${port}`);
  logger.log(`📖 Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.log(`🗄️  Database: ${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 5432}`);
}
bootstrap();
