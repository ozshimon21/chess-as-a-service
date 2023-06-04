import { PieceColor } from '../common/enums';
import { ChessBoard } from '../common/models/chess-board';

export class GameDto {
  nextPlayer: PieceColor;
  board: ChessBoard;
}
