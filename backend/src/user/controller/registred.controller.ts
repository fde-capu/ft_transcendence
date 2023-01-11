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
    // XXX registrar na base de dados, que usuário foi autenticado:
    //		chamar API42 /me, levantar dados do login
    //		gerar token de resposta
    if (!code || code === '')
      return response.status(400).json({
        error: 'You must provide a authorization code!',
      });
    try {
      const token = await this.userService.getToken(code);
      //const me = await this.userService.getMe(token);
      const me: MeDTO = {
        email: 'fulano@42sp.org.br',
        login: 'fu-lano',
        image: { versions: { large: '', medium: '', small: '', micro: '' } },
      };
      return response
        .cookie('acces_token', token.access_token, { httpOnly: true })
        .redirect('http://localhost:4200/game/?');
    } catch (e) {
      console.log('deu erro aqui no controller');
      response.status(e.response.status).json(e.response.data);
    }
  }
}
