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
		//console.log("Registred will call updateUser.");
      await this.userService.updateUser(intraId, user);
	  //console.log("Registred user saved:", user);
      return response.status(200).json({});
    } catch (e) {
      response.status(e.status).json(e.data);
    }
    this.userService.updateUser(intraId, user);
  }

  @Get('userByLogin')
  @UseGuards(AuthGuard)
  async getUserByIntraId(
    @Query('intraId') code: string,
    @Res() response: Response = null,
  ): Promise<any> {
	if (!code)
	{
		//console.log("RegContr cant search undefined");
		return response.status(400).json("Who should I search for?");
	}
    try {
		//console.log("RegContr will search for", code);
      const resp =  await this.userService.getUserByIntraId(code);
      return response.status(200).json(resp);
    } catch (e) {
		//console.log("RegContr found exception", e);
      response.status(e.status).json(e.data);
    }
  }

	@Get('online')
	@UseGuards(AuthGuard)
	async getOnlineUsers(@Res()response:Response=null):Promise<any>
	{
		try {
			//console.log("reg online: fetching databaes.");
			const resp = await this.userService.getOnlineUsers();
			return response.status(200).json(resp);
		} catch (e) {
			//console.log("reg: online got catch", e);
			response.status(e.status).json(e.data);
		}
	}

  @Get('friends')
  @UseGuards(AuthGuard)
  async getFriends(
    @Query('with') intraId: string,
	@Res() response:Response=null
  ):Promise<any>
  {
	try {
		//console.log("reg friends: fetching friends.");
		const resp = await this.userService.getFriends(intraId);
		return response.status(200).json(resp);
	} catch (e) {
		//console.log("reg friends got catch", e);
		response.status(e.status).json(e.data);
	}
  }

  @Get('stats')
  @UseGuards(AuthGuard)
  async getStats(
    @Query('of') intraId: string,
	@Res() response:Response=null
  ):Promise<any>
  {
	try {
		//console.log("reg stats: fetching.");
		const resp = await this.userService.getStats(intraId);
		return response.status(200).json(resp);
	} catch (e) {
		//console.log("reg stats got catch", e);
		response.status(e.status).json(e.data);
	}
  }

  @Get('history')
  @UseGuards(AuthGuard)
  async getGameHistory(
    @Query('of') intraId: string,
	@Res() response:Response=null
  ):Promise<any>
  {
	try {
		console.log("reg history: fetching.");
		const resp = await this.userService.getGameHistory(intraId);
		return response.status(200).json(resp);
	} catch (e) {
		console.log("reg history got catch", e);
		response.status(e.status).json(e.data);
	}
  }
}
