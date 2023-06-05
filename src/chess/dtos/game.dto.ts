import { PieceColor } from '../common/enums';
import { ChessBoard } from '../common/models/chess-board';
import { ApiProperty } from '@nestjs/swagger';

export class GameDto {
  @ApiProperty()
  gameId: string;

  @ApiProperty()
  nextPlayer: PieceColor;

  @ApiProperty()
  board: ChessBoard;
}
