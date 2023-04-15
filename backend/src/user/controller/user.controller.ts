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
  Request,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
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
    @Request() req,
    @Param('intraId') intraId: string,
    @Res() response: Response = null,
    @Body() user: Users,
  ) {
    try {
      const userId = req.user.sub; // user that made the request
      if (userId !== intraId) {
        // check if the user is trying to update their own record
        throw new UnauthorizedException(
          'You are not authorized to update this record.',
        );
      }
      await this.userService.updateUser(intraId, user);
      return response.status(200).json({});
    } catch (e) {
      response.status(e.status).json(e.data);
    }
  }

  @Put('update-name')
  async updateName(
    @Body() name2: any,
    @Request() req,
    @Param('intraId') intraId: string,
    @Res() response: Response = null,
  ) {
    try {
      const userId = req.user.sub;
      const name = name2.name;
      if (!userId) {
        throw new BadRequestException('User ID not found in the request');
      }

      // Check if the user that made the request exists
      const user = await this.userService.findOneBy42Id(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Check if the name of the user is not the same name that he has right now
      if (user.name === name) {
        throw new BadRequestException(
          'New name is the same as the current name',
        );
      }

      // Check if the name is already in the database
      const existingUser = await this.userService.findOneByName(name);
      if (existingUser && existingUser.intraId !== user.intraId) {
        throw new ConflictException('Name already exists');
      }

      // Make sure that the name parameter is defined and not empty
      if (name.length < 4) {
        throw new BadRequestException(
          'Name need to has more than 4 charachters',
        );
      }

      // Update the name
      user.name = name;
      await this.userService.updateUserinDatabase(user);

      if (response) {
        response.json({ name });
      }
    } catch (error) {
      if (response) {
        response
          .status(HttpStatus.NOT_ACCEPTABLE)
          .json({ error: error.message });
      } else {
        throw new InternalServerErrorException(error.message);
      }
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

  @Get('all')
  async getAllUsers(@Res() response: Response = null): Promise<any> {
    try {
      const resp = await this.userService.getAllUsers();
      return response.status(200).json(resp);
    } catch (e) {
      response.status(e.status).json(e.data);
    }
  }

  @Get('rankingAll')
  async getRanking(@Res() response: Response): Promise<void> {
    try {
      const users = await this.userService.getAllUsers();
      const ladder = users.sort((a, b) => b.score - a.score);
      let i = 0;
      for (const s of ladder) {
        s.position = ++i;
      }
      response.status(200).json(ladder);
    } catch (e) {
      response.status(e.status).json(e.data);
    }
  }

  @Get('ranking/:id')
  async getUserRanking(
    @Res() response: Response,
    @Param('id') id: string,
  ): Promise<void> {
    try {
      const users = await this.userService.getAllUsers();
      const ladder = users.sort((a, b) => b.score - a.score);
      let i = 0;
      for (const s of ladder) {
        s.position = ++i;
      }
      const user = users.find((user) => user.intraId === id);
      response.status(200).json(user.position);
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
        destination: '/var/tmp/uploads',
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
    @Res() response: Response = null,
  ) {
    try
    {
    const user = await this.userService.findOneBy42Id(payload.sub);
      if (!user) {
        throw new NotFoundException('User not found');
      }
    await this.userService.updateProfileImage(payload.sub, file.filename);
    return file;
    }
    catch (error)
    {
      response.status(HttpStatus.NOT_ACCEPTABLE).json({ error: error.message });
    }
  }
}
