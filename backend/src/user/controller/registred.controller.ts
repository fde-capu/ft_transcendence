import { Controller, Get, Query, Res } from '@nestjs/common';
import { MeDTO, UserService } from '../service/user.service';
import { Response } from 'express';

@Controller('user/register')
export class RegisterController {
  constructor(private readonly userService: UserService) {}
  @Get()
  async registerUser(
    @Query('code') code: string,
    @Res() response: Response = null,
  ): Promise<any> {
    try {
      const basicUser = await this.userService.registerUser(code);
      return response
        .cookie('access_token', basicUser.token)
        .cookie('intra_id', basicUser.login)
        .redirect('http://localhost:4200/game');
    } catch (e) {
      console.log('RegisterController failed to generate unique token.');
      console.log(e);
      response.status(e.status).json(e.data);
    }
  }
}
