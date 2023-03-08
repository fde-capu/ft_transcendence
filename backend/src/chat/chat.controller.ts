import { Body, Controller, Get, Param, Post, Put, Query, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from 'src/auth/guard/auth.guard';

@Controller('chatrooms')
export class ChatController {
  constructor(
  ) {}

  @Get('')
  @UseGuards(AuthGuard)
  async getRooms(
	@Res() response:Response=null
  ): Promise<any> {
	try {
		//return response.status(400).json("Who should I search for?");
      //const resp =  await this.userService.getUserByIntraId(code);
      return response.status(200).json("Hayheyheyhey");
    } catch (e) {
      response.status(e.status).json(e.data);
    }
  }
}
