import { BaseText, Path } from "slate";

export interface Suggestion extends BaseText {
  id: string;
  path: Path;
}
