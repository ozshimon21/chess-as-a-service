import { Injectable } from '@nestjs/common';
import { ChessMove } from '../entities/chess-move';
import { ChessBoard } from '../common/models/chess-board';
import { SquareCoordinatePairDto } from '../dtos/square-coordinate-pair.dto';
import { PawnService } from './pawn.service';
import { ChessBoardService } from './chess-board.service';
import { PieceType } from '../common/enums';

/**
 * 
 */
@Injectable()
export class ChessService {
  constructor(private chessBoardService: ChessBoardService, private pawnService: PawnService) {}

  createChessBoard(): ChessBoard {
    return this.chessBoardService.createChessBoard();
  }

  findAllValidChessMoves(board: ChessBoard, square: SquareCoordinatePairDto) {
    const chessPiece = this.chessBoardService.getChessPieceAtSquare(board, square);

    if (!chessPiece)
      throw new Error(
        `There is no chess piece present at square ${square.coordinatePair} on the board.`,
      );

    //Limitation - check valid moves just for Pawns
    if (chessPiece.type !== PieceType.PAWN)
      throw new Error(
        `Moving game pieces other than pawns is not allowed and considered invalid.(Limitation)`,
      );

    return this.pawnService.findAllValidChessMoves(board, square);
  }

  public updateBoard(
    board: ChessBoard,
    fromSquare: SquareCoordinatePairDto,
    toSquare: SquareCoordinatePairDto,
  ): ChessMove {
    // Validates the move
    const validChessMove = this.pawnService.isValidMove(board, fromSquare, toSquare);
    if (!validChessMove) {
      throw new Error('Its not a valid move');
    }

    // move chess piece
    this.chessBoardService.moveChessPiece(board, fromSquare, toSquare);

    return validChessMove;
  }
}
