import { Body, Controller, Get, Query, Res } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { Response } from 'express';

@Controller('user/register')
export class RegisterController {
  constructor(private readonly userService: UserService) {}
  @Get()
  async code(
    @Query('code') code: string,
    @Res() response: Response = null,
  ): Promise<void> {
    // XXX registrar na base de dados, que usuário foi autenticado:
    //		chamar API42 /me, levantar dados do login
    //		gerar token de resposta

    try {
      const user = await this.userService.registerUser(code);
      response.redirect('http://127.0.0.6/game/?');
    } catch (e) {
      console.log(e);
    }
  }
}
