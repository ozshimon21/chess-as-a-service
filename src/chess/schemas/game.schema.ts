import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { PieceColor } from '../common/enums';
import { ChessBoard } from '../common/models/chess-board';

@Schema({
  timestamps: true,
})
export class Game {
  @Prop()
  nextPlayer: PieceColor;

  @Prop()
  board: ChessBoard;
}

export const GameSchema = SchemaFactory.createForClass(Game);
