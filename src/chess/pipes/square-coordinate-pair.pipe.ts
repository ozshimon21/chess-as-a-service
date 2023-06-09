import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { SquareCoordinatePairDto } from '../dtos/square-coordinate-pair.dto';
import { CoordinateService } from '../services/coordinate.service';

@Injectable()
export class SquareCoordinatePairPipe implements PipeTransform {
  constructor(private coordinateService: CoordinateService) {}

  transform(value: string, metadata: ArgumentMetadata): SquareCoordinatePairDto {
    try {
      this.coordinateService.validateSquareCoordinates(value);

      return {
        coordinatePair: value,
        letter: value[0],
        number: parseInt(value[1]),
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
