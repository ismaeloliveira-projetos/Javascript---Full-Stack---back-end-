import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { UrlRepository } from './repositories/url.repository';
import { randomBytes } from 'crypto';
import { nanoid } from 'nanoid';

@Injectable()
export class AppService {
  constructor(private readonly urlRepository: UrlRepository) {}

  async getAllUrls() {
    return this.urlRepository.findAll();
  }

  // Shorten URL com código customizado opcional
  async shortenUrl(originalUrl: string, customShortCode?: string) {
    if (!originalUrl || !/^(https?:\/\/)/i.test(originalUrl)) {
      throw new BadRequestException(
        'originalUrl must start with http:// or https://',
      );
    }

    let shortCode: string;
    let exists = true;
    let attempts = 0;

    do {
      if (customShortCode) {
        shortCode = customShortCode;
        exists = await this.urlRepository.existsShortCode(shortCode);
        if (exists)
          throw new BadRequestException('Este código personalizado já existe.');
      } else {
        shortCode = nanoid(4); // 4 caracteres Base62
        exists = await this.urlRepository.existsShortCode(shortCode);
      }

      attempts++;
      if (attempts > 5 && !customShortCode) {
        throw new BadRequestException(
          'Não foi possível gerar um código único. Tente novamente.',
        );
      }
    } while (!customShortCode && exists);

    return this.urlRepository.create({ originalUrl, shortCode });
  }

  // Incrementa cliques e retorna a URL original
  async redirectAndCount(shortCode: string) {
    const url = await this.urlRepository.findByShortCode(shortCode);
    if (!url) throw new NotFoundException('URL não encontrada');

    await this.urlRepository.incrementClicks(url.id);
    return url.originalUrl;
  }
}
