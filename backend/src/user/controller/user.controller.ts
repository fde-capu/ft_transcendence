import { Controller, Get, UseGuards } from '@nestjs/common';
import { JWTPayload } from 'jose';
import { Observable } from 'rxjs';
import { TokenPayload } from 'src/auth/decorator/token-payload.decorator';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { FortyTwoService } from 'src/forty-two/service/forty-two.service';
import { TokenResponse } from 'src/forty-two/service/token.response';
import { UserResponse } from 'src/forty-two/service/user.response';

@Controller('user')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly fortyTwoService: FortyTwoService) {}

  @Get('me')
  getCurrentUserInfo(
    @TokenPayload() payload: JWTPayload,
  ): Observable<UserResponse> {
    const fortyTwo = payload['fortyTwo'] as TokenResponse;
    return this.fortyTwoService.getUserInfo(fortyTwo.access_token);
  }
}
