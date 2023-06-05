import { Injectable } from '@nestjs/common';
import { ChessBoard } from '../common/models/chess-board';
import { PieceColor, PieceType } from '../common/enums';
import { SquareCoordinatePairDto } from '../dtos/square-coordinate-pair.dto';
import { CoordinateService } from './coordinate.service';
import { ChessPiece } from '../common/models/chess-piece';

/**
 * The Chessboard Service is responsible for creating, retrieving, and editing the chessboard.
 * It handles operations such as initializing a new chessboard, retrieving the current state of the
 * board, and modifying the board based on moves or other game actions.
 */
@Injectable()
export class ChessBoardService {
  constructor(private coordinateService: CoordinateService) {}

  /**
   * Retrieve the chess piece located at the specified square on the chessboard.
   * @param board The chessboard
   * @param squareCoordinatePairDto The square on the board
   */
  public getChessPieceAtSquare(
    board: ChessBoard,
    squareCoordinatePairDto: SquareCoordinatePairDto,
  ): ChessPiece {
    const result = this.coordinateService.convertCoordinatePairToGridCell(squareCoordinatePairDto);
    return board[result.row][result.col];
  }

  /**
   * Create a new chessboard.
   */
  public createChessBoard(): ChessBoard {
    const board: ChessBoard = Array.from({ length: 8 });

    for (let row = 0; row < 8; row++) {
      if (row > 1 && row < 6) {
        board[row] = Array.from({ length: 8 });
        continue;
      }

      const color = row === 0 || row == 1 ? PieceColor.BLACK : PieceColor.WHITE;

      if (row == 1 || row == 6) {
        board[row] = [
          { type: PieceType.PAWN, color: color },
          { type: PieceType.PAWN, color: color },
          { type: PieceType.PAWN, color: color },
          { type: PieceType.PAWN, color: color },
          { type: PieceType.PAWN, color: color },
          { type: PieceType.PAWN, color: color },
          { type: PieceType.PAWN, color: color },
          { type: PieceType.PAWN, color: color },
        ];
        continue;
      }

      if (row == 0 || row == 7) {
        board[row] = [
          { type: PieceType.ROOK, color: color },
          { type: PieceType.KNIGHT, color: color },
          { type: PieceType.BISHOP, color: color },
          { type: PieceType.KING, color: color },
          { type: PieceType.QUEEN, color: color },
          { type: PieceType.BISHOP, color: color },
          { type: PieceType.KNIGHT, color: color },
          { type: PieceType.ROOK, color: color },
        ];
        continue;
      }
    }

    return board;
  }

  /**
   * Move the chess piece from the origin coordinate to the destination coordinate on the chessboard.
   * @param board The chessboard
   * @param fromSquare The origin coordinate of the chess piece from
   * @param toSquare The destination coordinate of the chess piece from
   */
  moveChessPiece(
    board: ChessBoard,
    fromSquare: SquareCoordinatePairDto,
    toSquare: SquareCoordinatePairDto,
  ) {
    const fromCell = this.coordinateService.convertCoordinatePairToGridCell(fromSquare);
    const toCell = this.coordinateService.convertCoordinatePairToGridCell(toSquare);

    board[toCell.row][toCell.col] = board[fromCell.row][fromCell.col];
    board[fromCell.row][fromCell.col] = null;
  }
}
