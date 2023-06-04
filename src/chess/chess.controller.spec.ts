import { Test, TestingModule } from '@nestjs/testing';
import { ChessController } from './chess.controller';

describe('ChessController', () => {
  let controller: ChessController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChessController],
    }).compile();

    controller = module.get<ChessController>(ChessController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
