import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { AppService } from './app.service';
import { ShortenUrlDto } from './dto/shorten-url.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // Verificação raiz
  @Get()
  getRoot() {
    return {
      status: 'OK',
      message: '🚀 Backend rodando! API pronta para receber requisições.',
    };
  }

  // Lista todas URLs salvas
  @Get('urls')
  async getUrls() {
    const urls = await this.appService.getAllUrls();
    // Retorna também o total de URLs para o front-end
    return { total: urls.length, urls };
  }

  // Encurta a URL
  @Post('shorten')
  async shorten(@Body() body: ShortenUrlDto) {
    const url = body.url;

    const shortUrl = await this.appService.shortenUrl(url);

    return {
      message: 'URL encurtada com sucesso!',
      data: shortUrl,
    };
  }

  // Redireciona + incrementa contador
  @Get('redirect/:code')
  async redirect(@Param('code') code: string) {
    const originalUrl = await this.appService.redirectAndCount(code);

    if (!originalUrl) {
      throw new NotFoundException('Código de URL não encontrado.');
    }

    return { originalUrl };
  }
}
