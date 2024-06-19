import { createContext } from "react";
import { GrammarContextValue } from ".";

const GrammarContext = createContext<GrammarContextValue | null>(null);

export default GrammarContext;
