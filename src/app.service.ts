import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { randomBytes } from 'crypto';

const prisma = new PrismaClient();

@Injectable()
export class AppService {
  async getAllUrls() {
    return prisma.url.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async shortenUrl(originalUrl: string) {
    const shortCode = randomBytes(3).toString('hex');
    const url = await prisma.url.create({
      data: { originalUrl, shortCode },
    });

    return {
      ...url,
      shortUrl: `${process.env.BASE_URL}/${shortCode}`,
    };
  }

  // Incrementa clicks e retorna a URL original
  async redirectAndCount(shortCode: string) {
    const url = await prisma.url.findUnique({ where: { shortCode } });
    if (!url) throw new NotFoundException('URL não encontrada');

    await prisma.url.update({
      where: { id: url.id },
      data: { clicks: url.clicks + 1 },
    });

    return url.originalUrl;
  }
}
