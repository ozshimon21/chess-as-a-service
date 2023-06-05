import { Injectable } from '@nestjs/common';
import { ChessPieceManager } from '../interfaces/chess-piece-manager';
import { ChessBoard } from '../common/models/chess-board';
import { SquareCoordinatePairDto } from '../dtos/square-coordinate-pair.dto';
import { ChessMove } from '../entities/chess-move';
import { GridCell } from '../common/models/grid-cell';
import { ChessMoveType, PieceColor, PieceType } from '../common/enums';
import { CoordinateService } from './coordinate.service';

@Injectable()
export class PawnService implements ChessPieceManager {
  constructor(private coordinateService: CoordinateService) {}

  public isValidMove(board: ChessBoard, from: GridCell, to: GridCell): ChessMove {
    const fromCoordinatePair = this.coordinateService.convertGridCellToCoordinatePair(from);
    const toCoordinatePair = this.coordinateService.convertGridCellToCoordinatePair(to);

    // if (board[from.row][from.col].color !== nextPlayer)
    //   throw new Error(
    //     `The move is invalid. The next player to play should be the ${game.nextPlayer} player.`,
    //   );

    //Todo: maybe other functions
    // check from and to in the boundaries of the board
    if (from.row < 0 || from.row > 7) throw new Error(`form not in the board boundaries`);

    const fromPiece = board[from.row][from.col];

    if (to.row < 0 || to.row > 7) throw new Error(`form not in the board boundaries`);

    if (!board[from.row][from.col])
      throw new Error(`There is no game piece present on grid index: [${from.row},${from.col}.`);

    const toPiece = board[to.row][to.col];

    if (board[to.row][to.col]?.color == fromPiece.color)
      throw new Error(`same piece color on both grid cells`);

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
          type: ChessMoveType.MOVE,
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
          type: ChessMoveType.MOVE,
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
          type: ChessMoveType.MOVE,
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
          type: ChessMoveType.MOVE,
        };
      }
    }

    return null;
  }

  public findAllValidChessMoves(board: ChessBoard, square: SquareCoordinatePairDto): ChessMove[] {
    const from = this.coordinateService.convertCoordinatePairToGridCell(square);

    const piece = board[from.row][from.col];
    if (!piece) throw new Error(`There is no game piece present on cell ${square.coordinatePair}.`);

    //Limitation - check valid moves just for Pawns
    if (piece.type !== PieceType.PAWN)
      throw new Error(`It is invalid to move game pieces other than pawns. (Limitation)`);

    const moves: Array<ChessMove> = [];
    const row = from.row;
    const col = from.col;

    if (piece.color == PieceColor.BLACK) {
      let move = this.isValidMove(board, from, { row: row + 1, col: col });
      if (move) moves.push(move);

      move = this.isValidMove(board, from, { row: row + 2, col: col });
      if (move) moves.push(move);

      move = this.isValidMove(board, from, { row: row + 1, col: col - 1 });
      if (move) moves.push(move);

      move = this.isValidMove(board, from, { row: row + 1, col: col + 1 });
      if (move) moves.push(move);
    } else {
      let move = this.isValidMove(board, from, { row: row - 1, col: col });
      if (move) moves.push(move);

      move = this.isValidMove(board, from, { row: row - 2, col: col });
      if (move) moves.push(move);

      move = this.isValidMove(board, from, { row: row - 1, col: col + 1 });
      if (move) moves.push(move);

      move = this.isValidMove(board, from, { row: row - 1, col: col - 1 });
      if (move) moves.push(move);
    }

    return moves;
  }
}
