import { HttpModule } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../../../src/user/controller/user.controller';
import { UserService } from '../../../src/user/service/user.service';
jest.mock('../../../src/user/service/user.service');

describe('RegisterController', () => {
  let controller: UserController;
  // let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
      imports: [HttpModule],
    }).compile();

    controller = module.get<UserController>(UserController);
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
