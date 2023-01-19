import { Test, TestingModule } from '@nestjs/testing';
import { BrkController } from './brk.controller';

describe('BrkController', () => {
  let controller: BrkController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BrkController],
    }).compile();

    controller = module.get<BrkController>(BrkController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
