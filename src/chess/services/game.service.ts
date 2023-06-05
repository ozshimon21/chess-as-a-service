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

@Injectable()
export class GameService {
  constructor(
    @InjectModel(Game.name) private gameModel: Model<Game>,
    @InjectModel(GameHistory.name) private gameHistoryModel: Model<GameHistory>,
    private chessService: ChessService,
    private chessBoardService: ChessBoardService,
  ) {}

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

  async findAllGames(): Promise<GameDto[]> {
    const games = await this.gameModel.find().exec();
    return games.map((game) => ({
      gameId: game.id,
      nextPlayer: game.nextPlayer,
      board: game.board,
    }));
  }

  async findGameById(gameId: string): Promise<GameDto> {
    const game = await this.gameModel.findById(gameId).exec();
    if (!game) throw new NotFoundException('The game was not found.');
    return {
      gameId: game.id,
      nextPlayer: game.nextPlayer,
      board: game.board,
    };
  }

  async getGameHistory(gameId: string): Promise<ChessMoveDto[]> {
    await this.findGameById(gameId);

    const query = this.gameHistoryModel.find({ gameID: gameId }).select('move');
    const result = await query.exec();
    return result.map((chessMove) => ({
      from: chessMove.move.from,
      to: chessMove.move.to,
      type: chessMove.move.type,
    }));
  }

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

  async updateGame(
    id: string,
    from: SquareCoordinatePairDto,
    to: SquareCoordinatePairDto,
  ): Promise<void> {
    const game = await this.findGameById(id);

    const fromSquarePlayerColor = this.chessBoardService.getChessPieceAtSquare(game.board, from);

    if (!fromSquarePlayerColor)
      throw new Error(
        `There is no chess piece present at square ${from.coordinatePair} on the board.`,
      );

    // Validate next player to player
    if (fromSquarePlayerColor.color !== game.nextPlayer) {
      throw new Error(`Invalid Move. The next player to player is the ${game.nextPlayer} player.`);
    }

    const move = this.chessService.updateBoard(game.board, from, to);
    if (!move) throw new Error('Move is not valid');

    const session = await this.gameModel.startSession();
    try {
      session.startTransaction();

      const gameUpdateResult = await this.gameModel.findByIdAndUpdate(
        id,
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
        gameID: id,
        move: move,
      });

      await session.commitTransaction();
    } catch (e) {
      await session.abortTransaction();
    }

    await session.endSession();
  }
}
