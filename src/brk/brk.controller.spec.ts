import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { BrkController } from './brk.controller';
import { BrkService } from './brk.service';

const mockConfigService = {
  get: (key: string) => {
    return;
  },
};

describe('BrkController', () => {
  let controller: BrkController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BrkController],
      providers: [
        BrkService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    controller = module.get<BrkController>(BrkController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
