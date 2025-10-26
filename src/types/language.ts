import { translations } from "@/translations/translations";

export type Language = "en" | "pl";

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (typeof translations)[Language];
}
