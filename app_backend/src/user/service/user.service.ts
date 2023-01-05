import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { env } from 'process';

@Injectable()
export class UserService {
    constructor(private readonly httpService: HttpService){}
    async registerUser(code: string){
        const responseToken = await this.httpService.axiosRef.post('https://api.intra.42.fr/oauth/token', {
            grant_type: 'authorization_code',
            client_id: 'u-s4t2ud-b02a235b40b43fcc4c00653871275c9f93069a8a1b6248f14c516166bfe94f6ax',
            client_secret: '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x',
            redirect_uri: 'http://localhost:3000/user/register',
            code
        });
        // if (responseToken){

        // }
        return responseToken.data;
    }
}
