import { Injectable } from '@nestjs/common';
import { ChessMove } from '../entities/chess-move';
import { ChessBoard } from '../common/models/chess-board';
import { SquareCoordinatePairDto } from '../dtos/square-coordinate-pair.dto';
import { PawnService } from './pawn.service';
import { ChessBoardService } from './chess-board.service';
import { CoordinateService } from './coordinate.service';

@Injectable()
export class ChessService {
  constructor(
    private chessBoardService: ChessBoardService,
    private coordinateService: CoordinateService,
    private pawnService: PawnService,
  ) {}

  createChessBoard(): ChessBoard {
    return this.chessBoardService.createChessBoard();
  }

  findAllValidChessMoves(board: ChessBoard, square: SquareCoordinatePairDto) {
    return this.pawnService.findAllValidChessMoves(board, square);
  }

  public updateBoard(
    board: ChessBoard,
    fromSquare: SquareCoordinatePairDto,
    toSquare: SquareCoordinatePairDto,
  ): ChessMove {
    const fromCell = this.coordinateService.convertCoordinatePairToGridCell(fromSquare);
    const toCell = this.coordinateService.convertCoordinatePairToGridCell(toSquare);

    // Validates the move
    const validChessMove = this.pawnService.isValidMove(board, fromCell, toCell);
    if (!validChessMove) {
      throw new Error('Its not a valid move');
    }

    // move chess piece
    board[toCell.row][toCell.col] = board[fromCell.row][fromCell.col];
    board[fromCell.row][fromCell.col] = null;

    return validChessMove;
  }
}
