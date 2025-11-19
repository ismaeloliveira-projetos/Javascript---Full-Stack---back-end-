import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    methods: 'GET,POST',
  });

  const PORT = process.env.PORT || 3001;

  await app.listen(PORT);
  console.log(`🚀 Backend rodando em http://localhost:${PORT}`);
}

bootstrap();
