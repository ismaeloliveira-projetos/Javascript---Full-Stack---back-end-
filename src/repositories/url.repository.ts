import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Url } from '@prisma/client';

@Injectable()
export class UrlRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Url[]> {
    return this.prisma.url.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async findByShortCode(shortCode: string): Promise<Url | null> {
    return this.prisma.url.findUnique({ where: { shortCode } });
  }

  /**
   * Cria uma nova URL encurtada.
   * Aceita apenas os campos permitidos pelo Prisma: originalUrl, shortCode, expiresAt (opcional).
   */
  async create({ originalUrl, shortCode, expiresAt }: { originalUrl: string; shortCode: string; expiresAt?: Date }): Promise<Url> {
    return this.prisma.url.create({
      data: {
        originalUrl,
        shortCode,
        ...(expiresAt ? { expiresAt } : {}),
      },
    });
  }

  async incrementClicks(id: number): Promise<void> {
    await this.prisma.url.update({
      where: { id },
      data: { clicks: { increment: 1 } },
    });
  }

  async existsShortCode(shortCode: string): Promise<boolean> {
    const found = await this.prisma.url.findUnique({ where: { shortCode } });
    return !!found;
  }
}
