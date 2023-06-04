import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { GameService } from './services/game.service';
import { Game } from './schemas/game.schema';
import { ChessMoveDto } from './dtos/chess-move.dto';
import { SquareCoordinatePairPipe } from './pipes/square-coordinate-pair/square-coordinate-pair.pipe';
import { SquareCoordinatePairDto } from './dtos/square-coordinate-pair.dto';
import { ChessMove } from './entities/chess-move';
import { ApiBadRequestResponse, ApiNotFoundResponse } from '@nestjs/swagger';
import { ParseObjectIdPipe } from './pipes/parse-object-id/parse-object-id.pipe';

@Controller('chess')
export class ChessController {
  constructor(private gameService: GameService) {}

  @Post('games')
  async createGame(): Promise<Game> {
    return this.gameService.createGame();
  }

  @Get('games')
  async getAllGames(): Promise<Game[]> {
    const result = await this.gameService.findAllGames();
    if (!result) throw new NotFoundException('No games were found');
    return result;
  }

  @Get('games/:id')
  async findGame(
    @Param('id', new ParseObjectIdPipe()) id: string,
  ): Promise<Game> {
    const result = await this.gameService.findGameById(id);
    if (!result) throw new NotFoundException(`Game id: ${id} was not found.`);
    return result;
  }

  @Get('games/:id/history')
  async findGameHistory(
    @Param('id', new ParseObjectIdPipe()) id: string,
  ): Promise<ChessMove[]> {
    return this.gameService.getGameHistory(id);
  }

  @Get('games/:id/moves/:square')
  async findValidMoves(
    @Param('id', new ParseObjectIdPipe()) id: string,
    @Param('square', SquareCoordinatePairPipe) square: SquareCoordinatePairDto,
  ): Promise<ChessMoveDto[]> {
    return this.gameService.findValidMovesByGameId(id, square);
  }

  @ApiBadRequestResponse({
    description: 'Invalid Move. cannot apply the move.',
  })
  @ApiNotFoundResponse({
    description: 'game id was not found',
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
      throw new BadRequestException('Failed to update game.', {
        cause: error,
        description: error.message,
      });
    }
  }
}
