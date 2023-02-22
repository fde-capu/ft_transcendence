import { createMock } from '@golevelup/ts-jest';
import { HttpModule } from '@nestjs/axios';
import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../../src/user/service/user.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
      imports: [HttpModule],
    }).useMocker(() => createMock()).compile();

    service = module.get<UserService>(UserService);
  });
  describe('registerUser', () =>{
    it('call methot without code', async () => {
      try{
        await service.registerUser('');
      }
      catch(err){
        const error = new BadRequestException()
        expect(err).toEqual(error);
      }
    });

  })
});
