import { SquareCoordinatePairDto } from './square-coordinate-pair.dto';

export class UpdateGameDto {
  readonly origin: SquareCoordinatePairDto;
  readonly destination: SquareCoordinatePairDto;
}
