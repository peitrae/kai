import { BaseText, Path } from "slate";

export interface SuggestionItem extends BaseText {
  path: Path;
}
