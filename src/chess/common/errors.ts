import { PieceColor } from './enums';

export class SquareCoordinatesValidationException extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class GameNotFoundException extends Error {
  constructor() {
    super(`The game was not found.`);
  }
}

//////////////////////////////
// Invalid Move Exceptions
/////////////////////////////
export class InvalidChessMove extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class OnlyPawnMovesException extends InvalidChessMove {
  constructor() {
    super(`Moving game pieces other than pawns is not allowed and considered invalid.(Limitation)`);
  }
}

export class BlankSquareException extends InvalidChessMove {
  constructor(squareCoordinates: string) {
    super(`There is no chess piece present at square ${squareCoordinates} on the board.`);
  }
}

export class InvalidChessMoveSquareToSquare extends InvalidChessMove {
  constructor(originSquareCoordinates: string, destinationSquareCoordinates: string) {
    super(
      `Invalid chess move from square ${originSquareCoordinates} to square ${destinationSquareCoordinates}.`,
    );
  }
}

export class InvalidChessMoveNextPlayerToPlay extends InvalidChessMove {
  constructor(player: PieceColor) {
    super(`Invalid Move. The next player to player is the ${player} player.`);
  }
}
