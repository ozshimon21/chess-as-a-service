import { Injectable } from '@nestjs/common';
import { ChessBoard } from '../common/models/chess-board';
import { PieceColor, PieceType } from '../common/enums';
import { SquareCoordinatePairDto } from '../dtos/square-coordinate-pair.dto';
import { CoordinateService } from './coordinate.service';

@Injectable()
export class ChessBoardService {
  constructor(private coordinateService: CoordinateService) {}

  public getPlayerColorAtSquare(
    board: ChessBoard,
    squareCoordinatePairDto: SquareCoordinatePairDto,
  ): PieceColor {
    const result = this.coordinateService.convertCoordinatePairToGridCell(
      squareCoordinatePairDto,
    );
    return board[result.row][result.col]?.color;
  }

  public createChessBoard(): ChessBoard {
    const board: ChessBoard = Array.from({ length: 8 });

    //Black
    board[0] = [
      { type: PieceType.ROOK, color: PieceColor.BLACK },
      { type: PieceType.KNIGHT, color: PieceColor.BLACK },
      { type: PieceType.BISHOP, color: PieceColor.BLACK },
      { type: PieceType.KING, color: PieceColor.BLACK },
      { type: PieceType.QUEEN, color: PieceColor.BLACK },
      { type: PieceType.BISHOP, color: PieceColor.BLACK },
      { type: PieceType.KNIGHT, color: PieceColor.BLACK },
      { type: PieceType.ROOK, color: PieceColor.BLACK },
    ];
    board[1] = [
      { type: PieceType.PAWN, color: PieceColor.BLACK },
      { type: PieceType.PAWN, color: PieceColor.BLACK },
      { type: PieceType.PAWN, color: PieceColor.BLACK },
      { type: PieceType.PAWN, color: PieceColor.BLACK },
      { type: PieceType.PAWN, color: PieceColor.BLACK },
      { type: PieceType.PAWN, color: PieceColor.BLACK },
      { type: PieceType.PAWN, color: PieceColor.BLACK },
      { type: PieceType.PAWN, color: PieceColor.BLACK },
    ];

    board[2] = Array.from({ length: 8 });
    board[3] = Array.from({ length: 8 });
    board[4] = Array.from({ length: 8 });
    board[5] = Array.from({ length: 8 });

    //White
    board[6] = [
      { type: PieceType.PAWN, color: PieceColor.WHITE },
      { type: PieceType.PAWN, color: PieceColor.WHITE },
      { type: PieceType.PAWN, color: PieceColor.WHITE },
      { type: PieceType.PAWN, color: PieceColor.WHITE },
      { type: PieceType.PAWN, color: PieceColor.WHITE },
      { type: PieceType.PAWN, color: PieceColor.WHITE },
      { type: PieceType.PAWN, color: PieceColor.WHITE },
      { type: PieceType.PAWN, color: PieceColor.WHITE },
    ];
    board[7] = [
      { type: PieceType.ROOK, color: PieceColor.WHITE },
      { type: PieceType.KNIGHT, color: PieceColor.WHITE },
      { type: PieceType.BISHOP, color: PieceColor.WHITE },
      { type: PieceType.KING, color: PieceColor.WHITE },
      { type: PieceType.QUEEN, color: PieceColor.WHITE },
      { type: PieceType.BISHOP, color: PieceColor.WHITE },
      { type: PieceType.KNIGHT, color: PieceColor.WHITE },
      { type: PieceType.ROOK, color: PieceColor.WHITE },
    ];

    return board;
  }
}
