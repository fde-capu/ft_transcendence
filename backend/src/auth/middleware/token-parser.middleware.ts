import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { TokenService } from '../service/token.service';

@Injectable()
export class TokenParserMiddleware implements NestMiddleware {
  constructor(private readonly tokenService: TokenService) {}
  async use(req: Request, res: Response, next: () => void) {
    if (!req.cookies['authorization']) return next();
    try {
      req['tokenPayload'] = await this.tokenService.inspect(
        req.cookies['authorization'],
      );
    } catch (error) {
      req['tokenPayload'] = undefined;
    } finally {
      return next();
    }
  }
}
