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
import { ChessMove } from './entities/chess-move';
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

@ApiTags('Chess')
@Controller('chess')
export class ChessController {
  constructor(private gameService: GameService) {}

  /**
   * Create new chess game.
   */
  @ApiOperation({ summary: 'Creates new chess game' })
  @ApiCreatedResponse({ description: 'The game was created sussfully' })
  @Post('games')
  async createGame(): Promise<GameDto> {
    return this.gameService.createGame();
  }

  /**
   * Fetch all chess games.
   */
  @ApiOperation({ summary: 'Fetches all chess games.' })
  @Get('games')
  async getAllGames(): Promise<GameDto[]> {
    const result = await this.gameService.findAllGames();
    if (!result) throw new NotFoundException('No games were found');
    return result;
  }

  /**
   * Find chess game by ID.
   */
  @ApiOperation({ summary: 'Find chess game by ID.' })
  @Get('games/:id')
  async findGame(@Param('id', new ParseObjectIdPipe()) id: string): Promise<Game> {
    const result = await this.gameService.findGameById(id);
    if (!result) throw new NotFoundException(`Game id: ${id} was not found.`);
    return result;
  }

  /**
   * Retrieve the move history of a chess game.
   */
  @ApiOperation({ summary: 'Retrieve the move history of a chess game.' })
  @Get('games/:id/history')
  async findGameHistory(@Param('id', new ParseObjectIdPipe()) id: string): Promise<ChessMove[]> {
    const gameHistory = await this.gameService.getGameHistory(id);
    return gameHistory;
  }

  /**
   * Retrieve all valid moves for a specific chess piece in a particular game.
   */
  @ApiOperation({
    summary: 'Retrieve all valid moves for a specific chess piece in a particular game.',
  })
  @Get('games/:id/valid-moves/:square')
  @ApiImplicitParam({ name: 'square', type: String })
  async findValidMoves(
    @Param('id', new ParseObjectIdPipe()) id: string,
    @Param('square', SquareCoordinatePairPipe) square: SquareCoordinatePairDto,
  ): Promise<ChessMoveDto[]> {
    try {
      return this.gameService.findValidMovesByGameId(id, square);
    } catch (error) {
      throw new BadRequestException(error?.message);
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
    description: 'The game ID could not be found.',
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
      throw new BadRequestException(error?.message);
    }
  }
}
