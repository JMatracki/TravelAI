import { STORAGE_KEYS } from "@/lib/config/constants";
import type { Language } from "@/types/language";
import type { Theme } from "@/types/theme";

export const getStoredTheme = (defaultTheme: Theme = "dark"): Theme => {
  try {
    if (typeof window === "undefined") return defaultTheme;

    const stored = localStorage.getItem(STORAGE_KEYS.THEME) as Theme | null;
    return stored || defaultTheme;
  } catch (error) {
    console.error("Failed to get stored theme:", error);
    return defaultTheme;
  }
};

export const setStoredTheme = (theme: Theme): boolean => {
  try {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
    return true;
  } catch (error) {
    console.error("Failed to store theme:", error);
    return false;
  }
};

export const getStoredLanguage = (
  defaultLanguage: Language = "en"
): Language => {
  try {
    if (typeof window === "undefined") return defaultLanguage;

    const stored = localStorage.getItem(
      STORAGE_KEYS.LANGUAGE
    ) as Language | null;
    return stored || defaultLanguage;
  } catch (error) {
    console.error("Failed to get stored language:", error);
    return defaultLanguage;
  }
};

export const setStoredLanguage = (language: Language): boolean => {
  try {
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, language);
    return true;
  } catch (error) {
    console.error("Failed to store language:", error);
    return false;
  }
};
