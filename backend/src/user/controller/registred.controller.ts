import { Body, Controller, Get, Param, Post, Put, Query, Res, UseGuards } from '@nestjs/common';
import { MeDTO, UserService } from '../service/user.service';
import { Response } from 'express';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { Users } from '../entity/user.entity';

@Controller('user')
export class RegisterController {
  constructor(private readonly userService: UserService) {}
  
  // @Post('register')
  // async register(){
  //   return this.userService.register({login: 'jestevam', email: "jjuu.com"});
  // }

  @Put('update/:login')
  @UseGuards(AuthGuard)
  async updateUser(
    @Param('login')login: string,
    @Res() response: Response = null,
    @Body()user: Users){
    try {
      await this.userService.updateUser(login, user);
      return response.status(200).json({});
    } catch (e) {
      response.status(e.status).json(e.data);
    }
    this.userService.updateUser(login, user);
  }

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
