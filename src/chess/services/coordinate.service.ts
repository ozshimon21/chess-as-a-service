import { Injectable } from '@nestjs/common';
import { SquareCoordinatePairDto } from '../dtos/square-coordinate-pair.dto';
import { GridCell } from '../common/models/grid-cell';

@Injectable()
export class CoordinateService {
  public validateSquareCoordinates(squareCoordinates: string): boolean {
    if (!squareCoordinates) throw new Error(`Square coordinates is empty`);

    if (squareCoordinates.length != 2)
      throw new Error(
        `Square coordinates should be identified by a letter and a number`,
      );

    if (squareCoordinates[0] < 'a' || squareCoordinates[0] > 'h')
      throw new Error(
        `The starting square coordinate must be a letter between 'a' and 'h'.`,
      );

    const secondCoordinate = parseInt(squareCoordinates[1]);
    if (!secondCoordinate || secondCoordinate < 1 || secondCoordinate > 8)
      throw new Error(
        `The second square coordinate must be a number between 1 and 8.`,
      );

    return true;
  }

  public convertCoordinatePairToGridCell(
    square: SquareCoordinatePairDto,
  ): GridCell {
    return {
      row: Math.abs(square.number - 8),
      col: square.letter.charCodeAt(0) - 'a'.charCodeAt(0),
    };
  }

  public convertGridCellToCoordinatePair(cell: GridCell): string {
    const coordinatePair = `${String.fromCharCode(
      'a'.charCodeAt(0) + cell.col,
    )}${Math.abs(cell.row - 8)}`;
    return coordinatePair;
  }
}
