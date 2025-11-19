import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // Rota raiz para verificar se o servidor está rodando
  @Get()
  getRoot() {
    return {
      message: '🚀 Backend rodando! API pronta para receber requisições.',
    };
  }

  @Get('urls')
  async getUrls() {
    return this.appService.getAllUrls();
  }

  @Post('shorten')
  async shorten(@Body('url') url: string) {
    return this.appService.shortenUrl(url);
  }

  // Endpoint que incrementa clicks e retorna originalUrl
  @Get('redirect/:code')
  async redirect(@Param('code') code: string) {
    const originalUrl = await this.appService.redirectAndCount(code);
    return { originalUrl };
  }
}
