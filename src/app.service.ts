import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { randomBytes } from 'crypto';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllUrls() {
    return this.prisma.url.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  // Cria e mantem uma URL encurtada
  async shortenUrl(originalUrl: string) {
    // validação básica: exigir protocolo http/https
    if (!originalUrl || !/^(https?:\/\/)/i.test(originalUrl)) {
      throw new BadRequestException(
        'originalUrl must be provided and start with http:// or https://',
      );
    }

    // cria um shortCode único (6 hex chars)
    const shortCode = randomBytes(3).toString('hex');

    const created = await this.prisma.url.create({
      data: {
        originalUrl,
        shortCode,
      },
    });

    return created;
  }

  // Incrementa clicks e retorna a URL original
  async redirectAndCount(shortCode: string) {
    const url = await this.prisma.url.findUnique({ where: { shortCode } });
    if (!url) throw new NotFoundException('URL não encontrada');

    await this.prisma.url.update({
      where: { id: url.id },
      data: { clicks: url.clicks + 1 },
    });

    return url.originalUrl;
  }
}
