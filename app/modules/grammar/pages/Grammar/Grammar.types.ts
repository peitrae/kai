import { Path } from "slate";

export interface IncorrectRange {
  start: number;
  end: number;
  path: Path;
}

export interface Suggestion {
  text: string;
  path: number[];
}
