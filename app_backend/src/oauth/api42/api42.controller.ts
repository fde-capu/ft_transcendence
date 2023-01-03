import { Body, Controller, Post } from '@nestjs/common';

@Controller('api42')
export class Api42Controller {
  @Post()
  code(@Body('code') code: string): object {
    return { message: `Voce enviou o codigo tal: ${code}` };
  }
}
