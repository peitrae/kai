import { SuggestionItem } from "../pages/Grammar";
import { json } from "@remix-run/node";

const correctValue: SuggestionItem[] = [
  {
    text: "She doesn't like apples.",
    path: [0, 0],
    id: "3",
  },
  { text: "Him and me ", path: [2, 0], id: "5" },
  { text: " to the store.", path: [2, 2], id: "7" },
];

class GrammarController {
  getSuggestions() {
    return json(correctValue);
  }
}

export default GrammarController;
