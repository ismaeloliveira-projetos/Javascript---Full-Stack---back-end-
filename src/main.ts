import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // integração com o Back e o front
  app.enableCors();

  await app.listen(3000);
}
bootstrap();
