import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UserService } from '../service/user.service';

@Controller('user/register')
export class RegisterController {
  constructor(private readonly userService: UserService){}
  @Get()
  code(@Query('code') code: string): object {
    return this.userService.registerUser(code);
  }
}
