import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client'; // apenas para tipos

@Injectable()
export class UrlRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Prisma.Url[]> {
    return this.prisma.url.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async findByShortCode(shortCode: string): Promise<Prisma.Url | null> {
    return this.prisma.url.findUnique({ where: { shortCode } });
  }

  async create(data: {
    originalUrl: string;
    shortCode: string;
    expiresAt?: Date;
  }): Promise<Prisma.Url> {
    return this.prisma.url.create({ data });
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
