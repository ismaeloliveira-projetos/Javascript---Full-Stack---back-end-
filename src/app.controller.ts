import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('urls')
  async getUrls() {
    return this.appService.getAllUrls();
  }

  @Post('shorten')
  async shorten(@Body('url') url: string) {
    return this.appService.shortenUrl(url);
  }

  @Get(':code')
  async redirect(@Param('code') code: string, @Res() res: Response) {
    try {
      const originalUrl = await this.appService.getOriginalUrl(code);
      return res.redirect(HttpStatus.FOUND, originalUrl);
    } catch (error) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: 'URL not found' });
    }
  }
}
