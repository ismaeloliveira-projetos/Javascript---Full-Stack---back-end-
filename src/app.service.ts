import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { nanoid } from 'nanoid';
import { UrlRepository } from './repositories/url.repository';

@Injectable()
export class AppService {
  constructor(private readonly urlRepository: UrlRepository) {}

  // Busca todas as URLs
  async getAllUrls() {
    return this.urlRepository.findAll();
  }

  // Cria e mantém uma URL encurtada
  async shortenUrl(originalUrl: string, customShortCode?: string) {
    // Validação básica: exigir protocolo http/https
    if (!originalUrl || !/^(https?:\/\/)/i.test(originalUrl)) {
      throw new BadRequestException(
        'originalUrl must be provided and start with http:// or https://',
      );
    }

    let shortCode: string;
    let exists = true;
    let tentativas = 0;

    do {
      if (customShortCode) {
        shortCode = customShortCode;
        exists = await this.urlRepository.existsShortCode(shortCode);
        if (exists)
          throw new BadRequestException('Este código personalizado já existe.');
      } else {
        shortCode = nanoid(5); // gera 5 caracteres Base62
        exists = await this.urlRepository.existsShortCode(shortCode);
        tentativas++;
        if (tentativas > 5)
          throw new BadRequestException(
            'Não foi possível gerar um código único. Tente novamente.',
          );
      }
    } while (!customShortCode && exists);

    const created = await this.urlRepository.create({
      originalUrl,
      shortCode,
      // expiresAt, //
    });

    return created;
  }

  // Incrementa clicks e retorna a URL original
  async redirectAndCount(shortCode: string) {
    const url = await this.urlRepository.findByShortCode(shortCode);
    if (!url) throw new NotFoundException('URL não encontrada');

    // Checar expiração (opcional)
    // if (url.expiresAt && url.expiresAt < new Date()) {
    //   throw new BadRequestException('URL expirada');
    // }

    // Incrementa o contador de cliques
    await this.urlRepository.incrementClicks(url.id);

    return url.originalUrl;
  }
}
