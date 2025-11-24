import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthMiddleware } from './auth.middleware';
import { PrismaService } from './prisma.service';
import { UrlRepository } from './repositories/url.repository';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, PrismaService, UrlRepository],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: 'redirect/:code', method: RequestMethod.GET }, // liberar endpoint público
      )
      .forRoutes('*'); // aplica para todas as outras rotas
  }
}
