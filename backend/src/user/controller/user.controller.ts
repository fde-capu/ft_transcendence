import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Post,
  Put,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from '../service/user.service';
import { Response } from 'express';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { Users } from '../entity/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { randomUUID } from 'crypto';
import { extname } from 'path';
import { TokenPayload } from 'src/auth/decorator/token-payload.decorator';
import { JWTPayload } from 'jose';

@Controller('user')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Put('update/:intraId')
  async updateUser(
    @Param('intraId') intraId: string,
    @Res() response: Response = null,
    @Body() user: Users,
  ) {
    try {
      console.log('< update', intraId);
      await this.userService.updateUser(intraId, user);
      return response.status(200).json({});
    } catch (e) {
      response.status(e.status).json(e.data);
    }
  }

  @Put('status/:intraId')
  async updateStatus(
    @Param('intraId') intraId: string,
    @Res() response: Response = null,
    @Body() stat: any,
  ) {
    try {
      UserService.status.set(intraId, stat.stat);
      return response.status(200).json(stat);
    } catch (e) {
      response.status(e.status).json(e.data);
    }
  }

  @Put('hi/:intraId')
  async attendance(
    @Param('intraId') intraId: string,
    @Res() response: Response = null,
    @Body() stat: any,
  ): Promise<any> {
    try {
      this.userService.presence(intraId);
      return response.status(200).json(':)');
    } catch (e) {
      response.status(e.status).json(e.data);
    }
  }

  @Get('userByLogin')
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
  async getOnlineUsers(@Res() response: Response = null): Promise<any> {
    try {
      const resp = await this.userService.getOnlineUsers();
      return response.status(200).json(resp);
    } catch (e) {
      response.status(e.status).json(e.data);
    }
  }

  @Get('available')
  async getAvailableUsers(@Res() response: Response = null): Promise<any> {
    try {
      const resp = await this.userService.getAvailableUsers();
      return response.status(200).json(resp);
    } catch (e) {
      response.status(e.status).json(e.data);
    }
  }

  @Get('friends')
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

  @Post('profile/image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename(req, file, callback) {
          callback(null, `${randomUUID()}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async changeProfileImage(
    @TokenPayload() payload: JWTPayload,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpe?g|png|gif)$/,
        })
        .addMaxSizeValidator({ maxSize: 3000000 })
        .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY }),
    )
    file: Express.Multer.File,
  ) {
    console.log(file);
    console.log(payload);
    const p = await this.userService.updateProfileImage(payload.sub, file.path);
    console.log(p);
    return file;
  }
}
