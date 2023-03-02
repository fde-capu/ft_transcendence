import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { JWTPayload } from 'jose';
import { TokenPayload } from '../decorator/token-payload.decorator';
import { AuthGuard } from '../guard/auth.guard';
import { AuthService } from '../service/auth.service';
import { UserService } from '../../user/service/user.service';

@Controller('auth')
export class AuthController {
  private frontendOrigin: string;

  constructor(
    private readonly authService: AuthService,
    readonly configService: ConfigService,
	private userService: UserService
  ) {
    this.frontendOrigin = this.configService.get<string>('FRONTEND_ORIGIN');
  }

  @Get('authorize')
  public authorize(@Res() res: Response, @Query('state') state?: string) {
    this.authService.redirectToAuthorizeEndpoint(res, state);
  }

  @Get('callback')
  public async callback(
    @Res() res: Response,
    @Query('code') code?: string,
    @Query('state') state?: string,
    @Query('error') error?: string,
    @Query('error_description') errorDescription?: string,
  ) {
    if (error)
      return this.authService.redirectToTheErrorPage(
        res,
        error,
        errorDescription,
      );
    const [token, options] = await this.authService.createSessionToken(
      code,
      state,
    );
    return res
      .cookie('authorization', token, options)
      .redirect(`${this.frontendOrigin}/login`);
  }

  @Get('logout')
  public logout(@Res() res: Response= null) {
	console.log("Back: called for logout...")
	this.userService.logOut();
	console.log("Back: logout");
    res
      .clearCookie('authorization')
      .json({ message: 'Did you have a good trip?' });
  }

  @Get('info')
  public tokenInfo(@TokenPayload() payload?: JWTPayload) {
    return this.authService.getSessionTokenPublicInfo(payload);
  }

  @Get('challenge')
  public enableChallenge(@TokenPayload() payload?: JWTPayload) {
    return this.authService.enableChallenge(payload);
  }

  @Post('challenge')
  public async verifyChallenge(
    @Res() res: Response,
    @Body() body: { token: string },
    @TokenPayload() payload?: JWTPayload,
  ) {
    const [token, options, response] = await this.authService.verifyChallenge(
      body.token,
      payload,
    );

    return res.cookie('authorization', token, options).json(response);
  }

  @Delete('challenge')
  @UseGuards(AuthGuard)
  public async disableChallenge(
    @Res() res: Response,
    @TokenPayload() payload?: JWTPayload,
  ) {
    const [token, options, response] = await this.authService.disableChallenge(
      payload,
    );
    return res.cookie('authorization', token, options).json(response);
  }
}
