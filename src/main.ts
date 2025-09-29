import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
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

  // Swagger API Documentation
  const config = new DocumentBuilder()
    .setTitle('Jacha Aru API')
    .setDescription(
      'Backend API for Fundación ARU\'s consultation management system. ' +
      'Jacha Aru (meaning "Great Voice" in Aymara) is a research data management platform ' +
      'that enables researchers to request, manage, and deliver statistical consultations.'
    )
    .setVersion('1.0')
    .addTag('auth', 'Authentication endpoints')
    .addTag('usuarios', 'User management')
    .addTag('categorias', 'Research categories')
    .addTag('temas', 'Research themes')
    .addTag('indicadores', 'Statistical indicators')
    .addTag('investigadores', 'Researcher profiles')
    .addTag('filtros', 'Data filters')
    .addTag('consultations', 'Consultation management')
    .addTag('data', 'Data sources and years')
    .addTag('responses', 'Consultation responses')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    customSiteTitle: 'Jacha Aru API Documentation',
    customfavIcon: 'https://nestjs.com/img/logo-small.svg',
    customCss: '.swagger-ui .topbar { display: none }',
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  logger.log(`🚀 Jacha Aru API is running on: http://localhost:${port}`);
  logger.log(`📖 API Documentation available at: http://localhost:${port}/api`);
  logger.log(`📖 Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.log(`🗄️  Database: ${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 5432}`);
}
bootstrap();
