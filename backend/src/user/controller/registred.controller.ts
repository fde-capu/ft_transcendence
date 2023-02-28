import { Body, Controller, Get, Param, Post, Put, Query, Res, UseGuards } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { Response } from 'express';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { Users } from '../entity/user.entity';

@Controller('user')
export class RegisterController {
  constructor(private readonly userService: UserService) {}
  
  // @Post('register')
  // async register(){
  //   return this.userService.register({intraId: 'jestevam', email: "jjuu.com"});
  // }

  @Put('update/:intraId')
  @UseGuards(AuthGuard)
  async updateUser(
    @Param('intraId')intraId: string,
    @Res() response: Response = null,
    @Body()user: Users){
    try {
      await this.userService.updateUser(intraId, user);
      return response.status(200).json({});
    } catch (e) {
      response.status(e.status).json(e.data);
    }
    this.userService.updateUser(intraId, user);
  }

  @Get('userByLogin')
  async getUserByIntraId(
    @Query('intraId') code: string,
    @Res() response: Response = null,
  ): Promise<any> {
	if (!code)
	{
		console.log("RegContr cant search undefined");
		return response.status(400).json("Who should I search for?");
	}
    try {
		console.log("RegContr will search for", code);
      const resp =  await this.userService.getUserByIntraId(code);
      return response.status(200).json(resp);
    } catch (e) {
		console.log("RegContr found exception", e);
      response.status(e.status).json(e.data);
    }
  }
}
