import { Controller, Get, Query, Res } from '@nestjs/common';
import { MeDTO, UserService } from '../service/user.service';
import { Response } from 'express';

@Controller('user/register')
export class RegisterController {
  constructor(private readonly userService: UserService) {}
  @Get()
  async code(
    @Query('code') code: string,
    @Res() response: Response = null,
  ): Promise<any> {
    if (!code || code === '')
      return response.status(400).json({
        error: 'Propoer code failed by API42.',
      });
    try {
      const tokenFrom42 = await this.userService.getToken(code);
      const me = await this.userService.getMe(tokenFrom42);
      // me = transform me into user_book dto. TODO
      const transcendToken = me.login + '_TOKENIZED';
      return response
        .cookie('access_token', transcendToken)
        .cookie('intra_id', me.login)
        .redirect('http://localhost:4200/game');
    } catch (e) {
      console.log('RegisterController failed to generate unique token.');
      console.log(e.response.data);
      response.status(e.response.status).json(e.response.data);
    }
  }
}
