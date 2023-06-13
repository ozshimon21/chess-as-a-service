import { Injectable } from '@nestjs/common';
import { ChessMove } from '../entities/chess-move';
import { ChessBoard } from '../common/models/chess-board';
import { SquareCoordinatePairDto } from '../dtos/square-coordinate-pair.dto';
import { PawnService } from './pawn.service';
import { ChessBoardService } from './chess-board.service';
import { PieceType } from '../common/enums';
import { BlankSquareException, InvalidChessMoveSquareToSquare, OnlyPawnMovesException } from '../common/errors';

/**
 * The ChessService handles all operations in a chess game, including creating the board, updating the game state,
 * and finding valid moves for chess pieces.
 */
@Injectable()
export class ChessService {
  constructor(private chessBoardService: ChessBoardService, private pawnService: PawnService) {}

  /**
   * Create a new chessboard.
   */
  createChessBoard(): ChessBoard {
    return this.chessBoardService.createChessBoard();
  }

  /**
   * Find all valid chess moves for a specific chessboard coordinate.
   * @param board The chessboard
   * @param square The origin square position on the board
   */
  findAllValidChessMoves(board: ChessBoard, square: SquareCoordinatePairDto) {
    const chessPiece = this.chessBoardService.getChessPieceAtSquare(board, square);

    if (!chessPiece) throw new BlankSquareException(square.coordinatePair);

    //Limitation - check valid moves just for Pawns
    if (chessPiece.type !== PieceType.PAWN) throw new OnlyPawnMovesException();

    //Find all valid moves
    return this.pawnService.findAllValidChessMoves(board, square);
  }

  /**
   * Update a chessboard with a chess move
   * @param board The chessboard
   * @param fromSquare The start position
   * @param toSquare The destination position
   */
  public updateBoard(
    board: ChessBoard,
    fromSquare: SquareCoordinatePairDto,
    toSquare: SquareCoordinatePairDto,
  ): ChessMove {
    // Validates the move
    const validChessMove = this.pawnService.isValidMove(board, fromSquare, toSquare);
    if (!validChessMove) {
      throw new InvalidChessMoveSquareToSquare(fromSquare.coordinatePair, toSquare.coordinatePair);
    }

    // move chess piece
    this.chessBoardService.moveChessPiece(board, fromSquare, toSquare);

    return validChessMove;
  }
}
