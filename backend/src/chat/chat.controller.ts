import { Body, Controller, Get, Param, Post, Put, Query, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { ChatService } from './chat.service';

@Controller('chatrooms')
export class ChatController {
  constructor(
	private readonly chatService: ChatService,
  ) {}

  @Get('/:for')
  @UseGuards(AuthGuard)
  async getRooms(
    @Param('for') intraId: string,
	@Res() response:Response=null
  ): Promise<any> {
	try {
      const resp = await this.chatService.getVisibleRooms(intraId);
      return response.status(200).json(resp);
    } catch (e) {
      response.status(e.status).json(e.data);
    }
  }
}
