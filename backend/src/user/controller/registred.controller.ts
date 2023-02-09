import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { MeDTO, UserService } from '../service/user.service';
import { Response } from 'express';
import { AuthGuard } from 'src/auth/guard/auth.guard';

@Controller('user')
export class RegisterController {
  constructor(private readonly userService: UserService) {}
  
  @Get('userByLogin')
  @UseGuards(AuthGuard)
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
