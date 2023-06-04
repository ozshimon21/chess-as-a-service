export class UpdateGameDto {
  readonly source: CellDto;
  readonly destination: CellDto;
}

export class CellDto {
  readonly gridLocation: string;
  readonly row: number;
  readonly col: number;
}
