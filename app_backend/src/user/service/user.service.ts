import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
    constructor(private readonly httpService: HttpService){}
    async registerUser(code: string){ // via API 42.
        const responseToken = await this.httpService.axiosRef.post('https://api.intra.42.fr/oauth/token', {
            grant_type: 'authorization_code',
            client_id: process.env.api42_client_id,
            client_secret: process.env.api42_client_secret,
            redirect_uri: 'http://localhost:3000/user/register',
            code
        });
        return responseToken.data;
    }
}
