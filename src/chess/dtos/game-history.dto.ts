import { PieceColor } from '../common/enums';
import { ApiProperty } from '@nestjs/swagger';
import { ChessMoveDto } from './chess-move.dto';
import { ChessPiece } from '../common/models/chess-piece';

export class GameHistoryDto {
  @ApiProperty({
    enum: PieceColor,
    description: 'The moving piece that preform the move.',
  })
  movingPiece: ChessPiece;

  @ApiProperty({
    type: String,
    description: 'The chess move.',
  })
  move: ChessMoveDto;
}
