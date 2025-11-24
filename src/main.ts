import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 🔥 Validação global (OBRIGATÓRIO para class-validator funcionar)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove campos extras
      forbidNonWhitelisted: false,
      transform: true, // transforma payload em DTO automaticamente
    }),
  );

  // 🔓 CORS
  app.enableCors({
    origin: '*',
    methods: 'GET,POST,PUT,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  });

  const PORT = process.env.PORT || 3001;

  await app.listen(PORT);
  console.log(`🚀 Backend rodando em http://localhost:${PORT}`);
}

bootstrap();
