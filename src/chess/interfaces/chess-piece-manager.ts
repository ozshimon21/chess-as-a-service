import { ChessBoard } from '../common/models/chess-board';
import { GridCell } from '../common/models/grid-cell';
import { ChessMove } from '../entities/chess-move';
import { SquareCoordinatePairDto } from '../dtos/square-coordinate-pair.dto';

export interface ChessPieceManager {
  isValidMove(board: ChessBoard, from: GridCell, to: GridCell): ChessMove;
  findAllValidChessMoves(board: ChessBoard, square: SquareCoordinatePairDto): ChessMove[];
}
