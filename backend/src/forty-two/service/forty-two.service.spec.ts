import { Test, TestingModule } from '@nestjs/testing';
import { FortyTwoService } from './forty-two.service';

describe('FortyTwoService', () => {
  let service: FortyTwoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FortyTwoService],
    }).compile();

    service = module.get<FortyTwoService>(FortyTwoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
