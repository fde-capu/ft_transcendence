import { HttpModule } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { RegisterController } from '../../../src/user/controller/registred.controller';
import { UserService } from '../../../src/user/service/user.service';
jest.mock('../../../src/user/service/user.service');

describe('RegisterController', () => {
  let controller: RegisterController;
  // let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RegisterController],
      providers: [UserService],
      imports: [HttpModule],
    }).compile();

    controller = module.get<RegisterController>(RegisterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call userService registerUser()', () => {
    controller.code('stringcode');
    expect(UserService).toBeCalled();
  });

  // it('/ (GET)', () => {
  //   return request(controller.code)
  //     .get('/')
  //     .expect(200)
  //     .expect('Hello World!');
  // });
});
