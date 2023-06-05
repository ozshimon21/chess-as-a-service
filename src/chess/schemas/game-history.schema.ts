import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ChessMove } from '../entities/chess-move';
import { ChessPiece } from '../common/models/chess-piece';

@Schema({
  timestamps: true,
})
export class GameHistory {
  @Prop()
  gameID: string;

  @Prop()
  movingPiece: ChessPiece;

  @Prop()
  move: ChessMove;
}

export const GameHistorySchema = SchemaFactory.createForClass(GameHistory);
