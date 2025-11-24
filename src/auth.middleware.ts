import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

//Funcionalidade de proteção de rotas da API
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (req.method === 'OPTIONS') {
      return next();
    }

    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      throw new UnauthorizedException('Token não fornecido');
    }

    const [type, token] = authHeader.split(' ');
    if (type !== 'Bearer' || token !== process.env.API_KEY) {
      throw new UnauthorizedException('Token inválido');
    }

    next();
  }
}
