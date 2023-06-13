import { Injectable } from '@nestjs/common';
import { SquareCoordinatePairDto } from '../dtos/square-coordinate-pair.dto';
import { GridCell } from '../common/models/grid-cell';
import { SquareCoordinatesValidationException } from '../common/errors';

/**
 * The Coordinate Service is responsible for validating and performing operations on coordinates.
 * It handles tasks such as validating the format of coordinates, converting coordinates between different grid systems.
 */
@Injectable()
export class CoordinateService {
  /**
   * Validates whether a square coordinate is valid. This validation typically involves checking if the coordinate
   * falls within the bounds of the chessboard grid, ensuring it corresponds to a valid square on the board.
   * A valid chessboard coordinate pair consists of a letter ranging from 'a' to 'h' (representing the columns)
   * and a number ranging from 1 to 8 (representing the rows).
   * @param squareCoordinates
   */
  public validateSquareCoordinates(squareCoordinates: string): boolean {
    if (!squareCoordinates)
      throw new SquareCoordinatesValidationException(`Square coordinates is empty`);

    if (squareCoordinates.length != 2)
      throw new SquareCoordinatesValidationException(
        `Square coordinates should be identified by a letter and a number.`,
      );

    if (squareCoordinates[0] < 'a' || squareCoordinates[0] > 'h')
      throw new SquareCoordinatesValidationException(
        `The initial square coordinate must be a letter between 'a' and 'h'.`,
      );

    const secondCoordinate = parseInt(squareCoordinates[1]);
    if (!secondCoordinate || secondCoordinate < 1 || secondCoordinate > 8)
      throw new SquareCoordinatesValidationException(
        `The secondary square coordinate must be a number between 1 and 8.`,
      );

    return true;
  }

  /**
   * Convert a chessboard coordinate pair to a grid cell coordinate(row and column).
   * @param square the coordinate pair to convert
   */
  public convertCoordinatePairToGridCell(square: SquareCoordinatePairDto): GridCell {
    return {
      row: Math.abs(square.number - 8),
      col: square.letter.charCodeAt(0) - 'a'.charCodeAt(0),
    };
  }

  /**
   * Convert a grid cell coordinate to chessboard coordinate pair.
   * @param cell The grid cell to convert
   */
  public convertGridCellToCoordinatePair(cell: GridCell): string {
    const coordinatePair = `${String.fromCharCode('a'.charCodeAt(0) + cell.col)}${Math.abs(
      cell.row - 8,
    )}`;
    return coordinatePair;
  }
}
