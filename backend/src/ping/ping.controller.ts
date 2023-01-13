import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

@Controller('ping')
export class PingController {
  @Get()
  ping(@Req() req: Request, @Res() res: Response): any {
    const access_token = req.cookies['access_token'];
    if (!access_token) // Must check if token is valid.
		return res.status(401).json({ message: 'You are ugly' });
    res.json({ message: `You are beautiful because you have access_token: ${access_token}` });
  }
}
