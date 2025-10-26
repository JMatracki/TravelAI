import { useState, ReactNode } from "react";
import { LanguageContext } from "@/contexts/LanguageContext";
import { translations } from "@/translations/translations";
import { getStoredLanguage, setStoredLanguage } from "@/lib/storage";
import type { Language, LanguageContextType } from "@/types/language";

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    return getStoredLanguage("en");
  });

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    const success = setStoredLanguage(lang);

    if (!success) {
      console.warn("Failed to persist language to localStorage");
    }
  };

  const value: LanguageContextType = {
    language,
    setLanguage: handleSetLanguage,
    t: translations[language],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
