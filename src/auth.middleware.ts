import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // ✔ Permitir requisições CORS pré-flight
    if (req.method === 'OPTIONS') {
      return next();
    }

    const authHeader = req.headers.authorization;

    // ✔ Falta de header
    if (!authHeader) {
      throw new UnauthorizedException('Token não fornecido');
    }

    // ✔ "Bearer TOKEN_AQUI"
    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer') {
      throw new UnauthorizedException('Formato do token inválido');
    }

    // ✔ Confere com o token do .env (API_KEY)
    if (!process.env.API_KEY) {
      console.error('❌ ERRO: API_KEY não encontrada no ambiente!');
      throw new UnauthorizedException('Erro interno de autenticação');
    }

    if (token !== process.env.API_KEY) {
      throw new UnauthorizedException('Token inválido');
    }

    // ✔ Continua
    next();
  }
}
