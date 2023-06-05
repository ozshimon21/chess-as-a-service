import { ApiProperty } from '@nestjs/swagger';

export class SquareCoordinatePairDto {
  @ApiProperty()
  coordinatePair: string;

  @ApiProperty()
  letter: string;

  @ApiProperty()
  number: number;
}
