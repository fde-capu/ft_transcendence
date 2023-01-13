import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

@Controller('ping')
export class PingController {
  @Get()
  ping(@Req() req: Request, @Res() res: Response): any {
    const access_token = req.cookies['access_token'];
    if (!access_token)
		return res.status(401).json({ message: 'You are ugly' });
    res.json({ message: `You are beautiful, got token from cookie: ${access_token}` });
  }
}
