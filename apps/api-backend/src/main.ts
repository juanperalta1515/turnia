import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: true, // Allow all origins for dev; specify domains in production
    credentials: true,
  });

  // Enable API Versioning
  app.enableVersioning({
    type: VersioningType.URI, // Prefix endpoints with /v1, /v2, etc.
    defaultVersion: '1',
  });

  // Global prefix
  app.setGlobalPrefix('api'); // Prefix becomes /api/v1/...

  // Global Validation Pipe for DTO validation and transformation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove properties not defined in DTO
      transform: true, // Auto-transform payloads to match DTO types
      forbidNonWhitelisted: true, // Reject payloads with undefined properties
    })
  );

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`TURNIA API Monolith listening on: http://localhost:${port}/api/v1`);
}
bootstrap();
