import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ChessMove } from '../entities/chess-move';

@Schema({
  timestamps: true,
})
export class GameHistory {
  @Prop()
  gameID: string;

  @Prop()
  move: ChessMove;
}

export const GameHistorySchema = SchemaFactory.createForClass(GameHistory);
