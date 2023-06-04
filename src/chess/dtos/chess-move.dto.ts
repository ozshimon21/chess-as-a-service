import { ChessMoveType } from '../common/enums';

export class ChessMoveDto {
  from: string;
  to: string;
  type: ChessMoveType;
}
