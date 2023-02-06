import { Controller, Get, Query, Res } from '@nestjs/common';
import { MeDTO, UserService } from '../service/user.service';
import { Response } from 'express';

@Controller('user')
export class RegisterController {
  constructor(private readonly userService: UserService) {}
  @Get('register')
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
      response.status(e.status).json(e.data);
    }
  }
  @Get('userByLogin')
  async getUserByLogin(
    @Query('login') code: string,
    @Res() response: Response = null,
  ): Promise<any> {
    try {
      const resp =  await this.userService.getUserByLogin(code);
      return response.status(200).json(resp);
    } catch (e) {
      response.status(e.status).json(e.data);
    }
  }
}
