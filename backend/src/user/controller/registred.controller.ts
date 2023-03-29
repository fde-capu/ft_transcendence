import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../service/user.service';
import { GameService } from '../../game/game.service';
import { Response } from 'express';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { Users } from '../entity/user.entity';

@Controller('user')
export class RegisterController {
  constructor(
    private readonly userService: UserService,
    private readonly gameService: GameService,
  ) {}

  @Put('update/:intraId')
  @UseGuards(AuthGuard)
  async updateUser(
    @Param('intraId') intraId: string,
    @Res() response: Response = null,
    @Body() user: Users,
  ) {
    try {
      await this.userService.updateUser(intraId, user);
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
    if (!code) {
      return response.status(400).json('Who should I search for?');
    }
    try {
      const resp = await this.userService.getUserByIntraId(code);
      return response.status(200).json(resp);
    } catch (e) {
      response.status(e.status).json(e.data);
    }
  }

  @Get('online')
  @UseGuards(AuthGuard)
  async getOnlineUsers(@Res() response: Response = null): Promise<any> {
    try {
      const resp = await this.userService.getOnlineUsers();
      return response.status(200).json(resp);
    } catch (e) {
      response.status(e.status).json(e.data);
    }
  }

  @Get('friends')
  @UseGuards(AuthGuard)
  async getFriends(
    @Query('with') intraId: string,
    @Res() response: Response = null,
  ): Promise<any> {
    try {
      const resp = await this.userService.getFriends(intraId);
      return response.status(200).json(resp);
    } catch (e) {
      response.status(e.status).json(e.data);
    }
  }

  @Get('blocks')
  @UseGuards(AuthGuard)
  async getBlocks(
    @Query('them') intraId: string,
    @Res() response: Response = null,
  ): Promise<any> {
    try {
      const resp = await this.userService.getBlocks(intraId);
      return response.status(200).json(resp);
    } catch (e) {
      response.status(e.status).json(e.data);
    }
  }

  @Get('stats')
  @UseGuards(AuthGuard)
  async getStats(
    @Query('of') intraId: string,
    @Res() response: Response = null,
  ): Promise<any> {
    try {
      const resp = await this.userService.getStats(intraId);
      return response.status(200).json(resp);
    } catch (e) {
      response.status(e.status).json(e.data);
    }
  }

  @Get('history')
  @UseGuards(AuthGuard)
  async getGameHistory(
    @Query('of') intraId: string,
    @Res() response: Response = null,
  ): Promise<any> {
    try {
      const resp = await this.gameService.getGameHistory(intraId);
      return response.status(200).json(resp);
    } catch (e) {
      response.status(e.status).json(e.data);
    }
  }
}
