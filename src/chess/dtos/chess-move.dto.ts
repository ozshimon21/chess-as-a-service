import { ChessMoveType } from '../common/enums';
import { ApiProperty } from '@nestjs/swagger';

export class ChessMoveDto {
  @ApiProperty()
  from: string;

  @ApiProperty()
  to: string;

  @ApiProperty()
  type: ChessMoveType;
}
