import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Game } from '../schemas/game.schema';
import { Model } from 'mongoose';
import { PieceColor } from '../common/enums';
import { ChessMoveDto } from '../dtos/chess-move.dto';
import { GameHistory } from '../schemas/game-history.schema';
import { ChessService } from './chess.service';
import { SquareCoordinatePairDto } from '../dtos/square-coordinate-pair.dto';
import { ChessBoardService } from './chess-board.service';
import { GameDto } from '../dtos/game.dto';
import { GameHistoryDto } from '../dtos/game-history.dto';

/**
 * The GameService is responsible for managing a chess game. It handles operations such as creating a new game,
 * updating the game state based on player moves, and retrieving the game history.
 */
@Injectable()
export class GameService {
  constructor(
    @InjectModel(Game.name) private gameModel: Model<Game>,
    @InjectModel(GameHistory.name) private gameHistoryModel: Model<GameHistory>,
    private chessService: ChessService,
    private chessBoardService: ChessBoardService,
  ) {}

  /**
   * Create a new chess game.
   */
  async createGame(): Promise<GameDto> {
    const game: Game = {
      nextPlayer: PieceColor.WHITE,
      board: this.chessService.createChessBoard(),
    };

    const newGame = await this.gameModel.create(game);
    return {
      gameId: newGame.id,
      nextPlayer: newGame.nextPlayer,
      board: newGame.board,
    };
  }

  /**
   * Find all chess games.
   */
  async findAllGames(): Promise<GameDto[]> {
    const games = await this.gameModel.find().exec();
    return games.map((game) => ({
      gameId: game.id,
      nextPlayer: game.nextPlayer,
      board: game.board,
    }));
  }

  /**
   * Find game by id.
   * @param gameId The game identifier
   */
  async findGameById(gameId: string): Promise<GameDto> {
    const game = await this.gameModel.findById(gameId).exec();
    if (!game) throw new NotFoundException('The game was not found.');
    return {
      gameId: game.id,
      nextPlayer: game.nextPlayer,
      board: game.board,
    };
  }

  /**
   * Retrieve the moves history of a chess game.
   * @param gameId The game identifier
   */
  async getGameHistory(gameId: string): Promise<GameHistoryDto[]> {
    await this.findGameById(gameId);

    const query = this.gameHistoryModel.find({ gameID: gameId }).select(['move', 'movingPiece']);
    const result = await query.exec();
    return result.map((chessMove) => ({
      movingPiece: chessMove.movingPiece,
      move: {
        from: chessMove.move.from,
        to: chessMove.move.to,
        type: chessMove.move.type,
      },
    }));
  }

  /**
   * Find all valid chess moves for a specific chessboard coordinate.
   * @param gameId The game identifier
   * @param square The origin square coordinate
   */
  async findValidMovesByGameId(
    gameId: string,
    square: SquareCoordinatePairDto,
  ): Promise<ChessMoveDto[]> {
    try {
      const game = await this.findGameById(gameId);

      const result = this.chessService.findAllValidChessMoves(game.board, square);

      return result.map((value) => ({
        type: value.type,
        from: value.from,
        to: value.to,
      }));
    } catch (e) {
      throw new BadRequestException(e);
    }
  }

  /**
   * Update a chessboard with a chess move
   * @param id
   * @param from The origin square coordinate
   * @param to The destination square coordinate
   */
  async updateGame(
    gameId: string,
    from: SquareCoordinatePairDto,
    to: SquareCoordinatePairDto,
  ): Promise<void> {
    const game = await this.findGameById(gameId);

    const chessPieceAtSquare = this.chessBoardService.getChessPieceAtSquare(game.board, from);

    if (!chessPieceAtSquare)
      throw new Error(
        `There is no chess piece present at square ${from.coordinatePair} on the board.`,
      );

    // Validate next player to player
    if (chessPieceAtSquare.color !== game.nextPlayer) {
      throw new Error(`Invalid Move. The next player to player is the ${game.nextPlayer} player.`);
    }

    const move = this.chessService.updateBoard(game.board, from, to);
    if (!move) throw new Error('Move is not valid');

    const session = await this.gameModel.startSession();
    try {
      //Creating a transaction to make sure both the game and the history saves to the database
      session.startTransaction();

      const gameUpdateResult = await this.gameModel.findByIdAndUpdate(
        gameId,
        {
          board: game.board,
          nextPlayer: game.nextPlayer == PieceColor.WHITE ? PieceColor.BLACK : PieceColor.WHITE,
        },
        {
          returnDocument: 'after',
          new: true,
          session: session,
        },
      );

      const gameHistoryUpdateResult = await this.gameHistoryModel.create({
        gameID: gameId,
        movingPiece: chessPieceAtSquare,
        move: move,
      });

      await session.commitTransaction();
    } catch (e) {
      await session.abortTransaction();
    }

    await session.endSession();
  }
}
