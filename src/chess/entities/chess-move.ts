import { ChessMoveType } from '../common/enums';

/**
 * The ChessMove entity represents a move in a chess game, consisting of the origin coordinate (the starting position)
 * and the destination coordinate (the target position).  * Additionally, it includes information about the result of
 * the move, which can be a regular move across the board or capturing an opposing piece.
 */
export class ChessMove {
  from: string;
  to: string;
  type: ChessMoveType;
}
