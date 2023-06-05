import { ChessMoveType } from '../common/enums';
import { ApiProperty } from '@nestjs/swagger';

export class ChessMoveDto {
  @ApiProperty({
    type: String,
    description: 'The coordinate pair that denotes the starting position of the chess move.',
  })
  from: string;

  @ApiProperty({
    type: String,
    description: 'The coordinate pair that denotes the destination position of the chess move.',
  })
  to: string;

  @ApiProperty({
    enum: ChessMoveType,
    description: 'The coordinate pair that denotes the destination position of the chess move.',
  })
  type: ChessMoveType;
}
