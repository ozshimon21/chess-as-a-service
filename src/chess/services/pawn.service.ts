import { Injectable, Logger } from '@nestjs/common';
import { ChessPieceManager } from '../interfaces/chess-piece-manager';
import { ChessBoard } from '../common/models/chess-board';
import { SquareCoordinatePairDto } from '../dtos/square-coordinate-pair.dto';
import { ChessMove } from '../entities/chess-move';
import { ChessMoveType, PieceColor } from '../common/enums';
import { CoordinateService } from './coordinate.service';
import { GridCell } from '../common/models/grid-cell';
import { BlankSquareException } from '../common/errors';

/**
 * The Pawn Service is responsible for implementing the logic for a pawn chess
 * piece in the game. It ensures that the pawn moves and captures are valid according to the
 * rules of chess.
 */
@Injectable()
export class PawnService implements ChessPieceManager {
  private readonly logger = new Logger(PawnService.name);

  constructor(private coordinateService: CoordinateService) {}

  /**
   * Find all valid chess moves for a specific square on the chess board.
   * @param board The chess board
   * @param square The starting position
   */
  public findAllValidChessMoves(board: ChessBoard, square: SquareCoordinatePairDto): ChessMove[] {
    const from = this.coordinateService.convertCoordinatePairToGridCell(square);

    const piece = board[from.row][from.col];
    if (!piece) throw new BlankSquareException(square.coordinatePair);

    const moves: Array<ChessMove> = [];
    const row = from.row;
    const col = from.col;

    if (piece.color == PieceColor.BLACK) {
      let move = this.isValidMoveInternal(board, from, { row: row + 1, col: col });
      if (move) moves.push(move);

      move = this.isValidMoveInternal(board, from, { row: row + 2, col: col });
      if (move) moves.push(move);

      move = this.isValidMoveInternal(board, from, { row: row + 1, col: col - 1 });
      if (move) moves.push(move);

      move = this.isValidMoveInternal(board, from, { row: row + 1, col: col + 1 });
      if (move) moves.push(move);
    } else {
      let move = this.isValidMoveInternal(board, from, { row: row - 1, col: col });
      if (move) moves.push(move);

      move = this.isValidMoveInternal(board, from, { row: row - 2, col: col });
      if (move) moves.push(move);

      move = this.isValidMoveInternal(board, from, { row: row - 1, col: col + 1 });
      if (move) moves.push(move);

      move = this.isValidMoveInternal(board, from, { row: row - 1, col: col - 1 });
      if (move) moves.push(move);
    }

    return moves;
  }

  /**
   * Validate if a move from one position to another on a chessboard is valid.
   * @param board The chess board
   * @param from The start position
   * @param to The destination position
   */
  public isValidMove(
    board: ChessBoard,
    from: SquareCoordinatePairDto,
    to: SquareCoordinatePairDto,
  ): ChessMove | null {
    const fromGridCell = this.coordinateService.convertCoordinatePairToGridCell(from);
    const toGridCell = this.coordinateService.convertCoordinatePairToGridCell(to);

    return this.isValidMoveInternal(board, fromGridCell, toGridCell);
  }

  /**
   * Validate if a move from one position to another on a chessboard is valid using grid cell coordinates.
   * @param board The chess board
   * @param from The start position
   * @param to The destination position
   */
  private isValidMoveInternal(board: ChessBoard, from: GridCell, to: GridCell): ChessMove | null {
    const fromCoordinatePair = this.coordinateService.convertGridCellToCoordinatePair(from);
    const toCoordinatePair = this.coordinateService.convertGridCellToCoordinatePair(to);

    // ensure that the cells are within the boundaries of the board.
    if (from.row < 0 || from.row > 7) {
      this.logger.debug(
        `The coordinates [${from.row},${from.col}] of the origin cell are outside the board boundaries.`,
      );
      return null;
    }

    const fromPiece = board[from.row][from.col];

    if (to.row < 0 || to.row > 7) {
      this.logger.debug(
        `The coordinates [${from.row},${from.col}] of the destination cell are outside the board boundaries.`,
      );
      return null;
    }

    if (!board[from.row][from.col]) {
      this.logger.debug(
        `There is no game piece present on the game board at the coordinates [${from.row},${from.col}].`,
      );
      return null;
    }

    const toPiece = board[to.row][to.col];

    if (board[to.row][to.col]?.color == fromPiece.color) {
      this.logger.debug(
        `Both the origin square and the destination square's game pieces belong to the same player.`,
      );
      return null;
    }

    if (fromPiece.color == PieceColor.BLACK) {
      //Move down one square
      if (from.row + 1 === to.row && from.col === to.col && toPiece === null) {
        return {
          from: fromCoordinatePair,
          to: toCoordinatePair,
          type: ChessMoveType.MOVE,
        };
      }

      //Move down two squares if it's the first move for black pawn
      if (from.row === 1 && from.row + 2 === to.row && from.col === to.col && toPiece === null) {
        return {
          from: fromCoordinatePair,
          to: toCoordinatePair,
          type: ChessMoveType.MOVE,
        };
      }

      //Move down one square left diagonally
      if (
        from.row + 1 === to.row &&
        from.col - 1 === to.col &&
        toPiece?.color === PieceColor.WHITE
      ) {
        return {
          from: fromCoordinatePair,
          to: toCoordinatePair,
          type: ChessMoveType.CAPTURE,
        };
      }

      //Move down one square right diagonally
      if (
        from.row + 1 === to.row &&
        from.col + 1 === to.col &&
        toPiece?.color === PieceColor.WHITE
      ) {
        return {
          from: fromCoordinatePair,
          to: toCoordinatePair,
          type: ChessMoveType.CAPTURE,
        };
      }
    } else {
      //Move up one square
      if (from.row - 1 === to.row && from.col === to.col && toPiece === null) {
        return {
          from: fromCoordinatePair,
          to: toCoordinatePair,
          type: ChessMoveType.MOVE,
        };
      }

      //Move up two squares if it's the first move for white pawn
      if (from.row === 6 && from.row - 2 === to.row && from.col === to.col && toPiece === null) {
        return {
          from: fromCoordinatePair,
          to: toCoordinatePair,
          type: ChessMoveType.MOVE,
        };
      }

      //Move up one square up left diagonally
      if (
        from.row - 1 === to.row &&
        from.col - 1 === to.col &&
        toPiece?.color === PieceColor.BLACK
      ) {
        return {
          from: fromCoordinatePair,
          to: toCoordinatePair,
          type: ChessMoveType.CAPTURE,
        };
      }

      //Move up one square up right diagonally
      if (
        from.row - 1 === to.row &&
        from.col + 1 === to.col &&
        toPiece?.color === PieceColor.BLACK
      ) {
        return {
          from: fromCoordinatePair,
          to: toCoordinatePair,
          type: ChessMoveType.CAPTURE,
        };
      }
    }

    return null;
  }
}
