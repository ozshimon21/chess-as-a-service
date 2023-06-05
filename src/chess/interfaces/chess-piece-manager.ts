import { ChessBoard } from '../common/models/chess-board';
import { ChessMove } from '../entities/chess-move';
import { SquareCoordinatePairDto } from '../dtos/square-coordinate-pair.dto';

/**
 * The ChessPieceManager interface represents the basic operations that a chess piece should implement to validate
 * and find its moves on the chessboard in a chess game. This interface defines methods that allow for validating
 * the legality of moves for the specific chess piece, as well as finding all possible valid moves for that piece
 * on the current state of the chessboard. Implementing this interface ensures consistent behavior across different
 * types of chess pieces while providing flexibility for custom rules and movements specific to each piece type.
 */
export interface ChessPieceManager {
  isValidMove(
    board: ChessBoard,
    from: SquareCoordinatePairDto,
    to: SquareCoordinatePairDto,
  ): ChessMove;
  findAllValidChessMoves(board: ChessBoard, square: SquareCoordinatePairDto): ChessMove[];
}
