import { Module } from '@nestjs/common';
import { ChessService } from './services/chess.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Game, GameSchema } from './schemas/game.schema';
import { GameService } from './services/game.service';
import { GameHistory, GameHistorySchema } from './schemas/game-history.schema';
import { ChessBoardService } from './services/chess-board.service';
import { CoordinateService } from './services/coordinate.service';
import { PawnService } from './services/pawn.service';
import { ChessController } from './chess.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Game.name, schema: GameSchema },
      { name: GameHistory.name, schema: GameHistorySchema },
    ]),
  ],
  controllers: [ChessController],
  providers: [CoordinateService, ChessService, GameService, ChessBoardService, PawnService],
})
export class ChessModule {}
