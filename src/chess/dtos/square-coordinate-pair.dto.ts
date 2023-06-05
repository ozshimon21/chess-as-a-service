import { ApiProperty } from '@nestjs/swagger';

/**
 * SquareCoordinatePairDto represents a chessboard coordinate pair consists of a letter ranging from 'a' to 'h'
 * (representing the columns) and a number ranging from 1 to 8 (representing the rows).
 */
export class SquareCoordinatePairDto {
  @ApiProperty()
  coordinatePair: string;

  @ApiProperty()
  letter: string;

  @ApiProperty()
  number: number;
}
