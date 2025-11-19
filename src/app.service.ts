import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { randomBytes } from 'crypto';

const prisma = new PrismaClient();

@Injectable()
export class AppService {
  // Requisito: Listar URLs criadas
  async getAllUrls() {
    return prisma.url.findMany({ orderBy: { createdAt: 'desc' } });
  }

  // Requisito: Encurtar uma URL
  async shortenUrl(originalUrl: string) {
    // Gera um código aleatório simples de 6 caracteres
    const shortCode = randomBytes(3).toString('hex');

    return prisma.url.create({
      data: {
        originalUrl,
        shortCode,
      },
    });
  }

  // Requisito: Redirecionar e contabilizar acesso [cite: 40, 42]
  async getOriginalUrl(shortCode: string) {
    const url = await prisma.url.findUnique({ where: { shortCode } });

    if (!url) throw new NotFoundException('URL não encontrada');

    // Incrementa cliques
    await prisma.url.update({
      where: { id: url.id },
      data: { clicks: url.clicks + 1 },
    });

    return url.originalUrl;
  }
}
