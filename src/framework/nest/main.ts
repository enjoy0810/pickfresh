import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { graphqlUploadExpress } from 'graphql-upload';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  try {
    const logger = new Logger('Bootstrap');
    // const app = await NestFactory.create(AppModule);
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
    // Enable CORS with specific options
    app.enableCors({
      origin: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization'],
      maxAge: 3600,
    });

    app.setGlobalPrefix('api');
  
    app.useGlobalPipes(new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }));

    app.useStaticAssets(join(process.cwd(), 'uploads'), {
      prefix: '/uploads/',
    });

    app.use(graphqlUploadExpress({ maxFileSize: 5_000_000, maxFiles: 5 }));

    const port = process.env.PORT || '8080';
    logger.log(`Server is running on port ${port}`);

    await app.listen(parseInt(port, 10), '0.0.0.0');
    logger.log(`Server is running on port http://localhost:${port}/api`);
    logger.log(`GraphQL Playground is running on port http://localhost:${port}/graphql`);
  } catch (error) {
    console.error('Failed to bootstrap the application:', error);
    process.exit(1);
  }
}
bootstrap();