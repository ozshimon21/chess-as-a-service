import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { SquareCoordinatePairDto } from '../../dtos/square-coordinate-pair.dto';
import { CoordinateService } from '../../services/coordinate.service';

@Injectable()
export class SquareCoordinatePairPipe implements PipeTransform {
  constructor(private coordinateService: CoordinateService) {}

  transform(
    value: string,
    metadata: ArgumentMetadata,
  ): SquareCoordinatePairDto {
    try {
      if (!this.coordinateService.validateSquareCoordinates(value))
        throw new Error('Something went wrong');

      return {
        coordinatePair: value,
        letter: value[0],
        number: parseInt(value[1]),
      };
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
}
