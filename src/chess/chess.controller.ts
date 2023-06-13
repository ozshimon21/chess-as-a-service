import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { GameService } from './services/game.service';
import { Game } from './schemas/game.schema';
import { ChessMoveDto } from './dtos/chess-move.dto';
import { SquareCoordinatePairPipe } from './pipes/square-coordinate-pair.pipe';
import { SquareCoordinatePairDto } from './dtos/square-coordinate-pair.dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ParseObjectIdPipe } from './pipes/parse-object-id.pipe';
import { ApiImplicitParam } from '@nestjs/swagger/dist/decorators/api-implicit-param.decorator';
import { GameDto } from './dtos/game.dto';
import { GameHistoryDto } from './dtos/game-history.dto';
import { GameNotFoundException, InvalidChessMove } from './common/errors';

@ApiTags('Chess')
@Controller('chess')
export class ChessController {
  constructor(private gameService: GameService) {}

  /**
   * Create new chess game.
   */
  @ApiOperation({ summary: 'Create new chess game' })
  @ApiCreatedResponse({ description: 'The game was created successfully' })
  @Post('games')
  async createGame(): Promise<GameDto> {
    return await this.gameService.createGame();
  }

  /**
   * Fetch all chess games.
   */
  @ApiOperation({ summary: 'Fetch all chess games.' })
  @ApiOkResponse({ description: 'The games were found successfully.' })
  @Get('games')
  async getAllGames(): Promise<GameDto[]> {
    try {
      const result = await this.gameService.findAllGames();
      if (!result) throw new NotFoundException('No games were found');
      return result;
    } catch (error) {
      if (error instanceof GameNotFoundException) throw new NotFoundException(error?.message);
      throw error;
    }
  }

  /**
   * Find chess game by ID.
   */
  @ApiOperation({ summary: 'Find chess game by ID.' })
  @ApiOkResponse({ description: 'The game was found successfully.' })
  @ApiNotFoundResponse({ description: 'The game was not found.' })
  @Get('games/:id')
  async findGame(@Param('id', new ParseObjectIdPipe()) id: string): Promise<Game> {
    try {
      const result = await this.gameService.findGameById(id);
      if (!result) throw new NotFoundException(`Game id: ${id} was not found.`);
      return result;
    } catch (error) {
      if (error instanceof GameNotFoundException) throw new NotFoundException(error?.message);
      throw error;
    }
  }

  /**
   * Retrieve the moves history of a chess game.
   */
  @ApiOperation({ summary: 'Retrieve the moves history of a chess game.' })
  @ApiOkResponse({ description: 'The game history was found successfully.' })
  @ApiNotFoundResponse({ description: 'The game history was not found.' })
  @Get('games/:id/history')
  async findGameHistory(
    @Param('id', new ParseObjectIdPipe()) id: string,
  ): Promise<GameHistoryDto[]> {
    try {
      const gameHistory = await this.gameService.getGameHistory(id);
      return gameHistory;
    } catch (error) {
      if (error instanceof GameNotFoundException) throw new NotFoundException(error?.message);
      throw error;
    }
  }

  /**
   * Retrieve all valid moves for a specific chess piece in a particular game.
   */
  @ApiOperation({
    summary: 'Retrieve all valid moves for a specific chess piece in a particular game.',
  })
  @ApiOkResponse({ description: 'Valid moves for the game were successfully found.' })
  @ApiNotFoundResponse({ description: 'The game history was not found.' })
  @Get('games/:id/valid-moves/:square')
  @ApiImplicitParam({ name: 'square', type: String })
  async findValidMoves(
    @Param('id', new ParseObjectIdPipe()) id: string,
    @Param('square', SquareCoordinatePairPipe) square: SquareCoordinatePairDto,
  ): Promise<ChessMoveDto[]> {
    try {
      return await this.gameService.findValidMovesByGameId(id, square);
    } catch (error) {
      if (error instanceof GameNotFoundException) throw new NotFoundException(error?.message);
      if (error instanceof InvalidChessMove) throw new BadRequestException(error?.message);
      throw error;
    }
  }

  /**
   * Update the game with a chess move.
   */
  @ApiOkResponse({
    description: 'The game was updated successfully.',
  })
  @ApiBadRequestResponse({
    description: 'Move is invalid.',
  })
  @ApiNotFoundResponse({
    description: 'The game id could not be found.',
  })
  @ApiBody({
    schema: {
      properties: {
        from: { type: 'string' },
        to: { type: 'string' },
      },
    },
  })
  @ApiOperation({
    summary: 'Update the game with a chess move.',
  })
  @Put('games/:id')
  async updateGame(
    @Param('id', new ParseObjectIdPipe()) id: string,
    @Body('from', SquareCoordinatePairPipe) from: SquareCoordinatePairDto,
    @Body('to', SquareCoordinatePairPipe) to: SquareCoordinatePairDto,
  ): Promise<void> {
    try {
      await this.gameService.updateGame(id, from, to);
    } catch (error) {
      if (error instanceof GameNotFoundException) throw new NotFoundException(error?.message);
      if (error instanceof InvalidChessMove) throw new BadRequestException(error?.message);
      throw error;
    }
  }
}
