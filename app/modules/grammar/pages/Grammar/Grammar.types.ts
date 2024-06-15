export interface IncorrectRange {
  start: number;
  end: number;
}

export interface Suggestion {
  text: string;
  path: number[];
}
