import { Test, TestingModule } from '@nestjs/testing';
import { BrpController } from './brp.controller';

describe('BRPController', () => {
  let brpController: BrpController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [BrpController],
    }).compile();

    brpController = app.get<BrpController>(BrpController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(brpController).toBeDefined();
    });
  });
});
