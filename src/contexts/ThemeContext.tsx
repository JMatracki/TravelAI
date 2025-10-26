import { createContext } from "react";
import { ThemeProviderState } from "@/types/theme";

export const ThemeContext = createContext<ThemeProviderState | undefined>(
  undefined
);
