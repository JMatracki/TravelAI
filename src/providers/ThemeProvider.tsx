import { useEffect, useState, useCallback } from "react";
import { ThemeContext } from "@/contexts/ThemeContext";
import { Theme, ThemeProviderProps, ThemeProviderState } from "@/types/theme";
import { getStoredTheme, setStoredTheme } from "@/lib/storage";

export const ThemeProvider = ({
  children,
  defaultTheme = "dark",
  ...props
}: ThemeProviderProps) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const initialTheme = getStoredTheme(defaultTheme);

    if (typeof window !== "undefined") {
      const root = document.documentElement;
      root.classList.remove("light", "dark");
      root.classList.add(initialTheme);
    }

    return initialTheme;
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  const handleSetTheme = useCallback((newTheme: Theme) => {
    setTheme(newTheme);
    const success = setStoredTheme(newTheme);

    if (!success) {
      console.warn("Failed to persist theme to localStorage");
    }
  }, []);

  const value: ThemeProviderState = {
    theme,
    setTheme: handleSetTheme,
  };

  return (
    <ThemeContext.Provider {...props} value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
