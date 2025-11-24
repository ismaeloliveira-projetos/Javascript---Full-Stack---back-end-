import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { randomBytes } from 'crypto';
import { UrlRepository } from './repositories/url.repository';

@Injectable()
export class AppService {
  constructor(private readonly urlRepository: UrlRepository) {}

  // Busca todas as URLs
  async getAllUrls() {
    return this.urlRepository.findAll();
  }

  // Cria e mantém uma URL encurtada
  async shortenUrl(originalUrl: string) {
    // Validação básica: exigir protocolo http/https
    if (!originalUrl || !/^(https?:\/\/)/i.test(originalUrl)) {
      throw new BadRequestException(
        'originalUrl must be provided and start with http:// or https://',
      );
    }

    // Garante unicidade do shortCode
    let shortCode: string;
    let exists = true;
    let tentativas = 0;
    do {
      shortCode = randomBytes(3).toString('hex');
      exists = await this.urlRepository.existsShortCode(shortCode);
      tentativas++;
      if (tentativas > 5) throw new BadRequestException('Não foi possível gerar um código único. Tente novamente.');
    } while (exists);

    // Exemplo: adicionar expiração de 30 dias (opcional)
    // const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    // Envia apenas os campos permitidos
    const created = await this.urlRepository.create({
      originalUrl,
      shortCode,
      // expiresAt, // descomente se quiser usar expiração
    });
    return created;
  }

  // Incrementa clicks e retorna a URL original
  async redirectAndCount(shortCode: string) {
    // Busca a URL pelo código curto
    const url = await this.urlRepository.findByShortCode(shortCode);
    if (!url) throw new NotFoundException('URL não encontrada');

    // Exemplo: checar expiração
    // if (url.expiresAt && url.expiresAt < new Date()) {
    //   throw new BadRequestException('URL expirada');
    // }

    // Incrementa o contador de cliques de forma atômica
    await this.urlRepository.incrementClicks(url.id);

    // Retorna a URL original para o controller
    return url.originalUrl;
  }
}
