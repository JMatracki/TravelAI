import { Moon, Sun, Globe } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/hooks/useLanguage";
import { useCallback, useRef } from "react";

export const Header = () => {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  const languageThrottleRef = useRef<NodeJS.Timeout | null>(null);
  const themeThrottleRef = useRef<NodeJS.Timeout | null>(null);

  const toggleLanguage = useCallback(() => {
    if (languageThrottleRef.current) return;

    setLanguage(language === "en" ? "pl" : "en");

    languageThrottleRef.current = setTimeout(() => {
      languageThrottleRef.current = null;
    }, 300);
  }, [language, setLanguage]);

  const toggleTheme = useCallback(() => {
    if (themeThrottleRef.current) return;

    setTheme(theme === "light" ? "dark" : "light");

    themeThrottleRef.current = setTimeout(() => {
      themeThrottleRef.current = null;
    }, 300);
  }, [theme, setTheme]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-glass-border bg-glass/80 backdrop-blur-glass">
      <nav
        className="container mx-auto px-4 h-16 flex items-center justify-between"
        aria-label="Main navigation"
      >
        <a
          href="/"
          title="Go to home page"
          className="flex items-center gap-2 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg hover:scale-105"
        >
          <div
            className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center"
            aria-hidden="true"
          >
            <span className="text-white font-bold text-xl">✈️</span>
          </div>
          <span className="font-bold text-xl">TravelAI</span>
        </a>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleLanguage}
            aria-label={t.nav.language}
            className="rounded-full transition-all duration-300 ease-in-out hover:scale-110 hover:bg-primary/10"
          >
            <Globe className="h-5 w-5" aria-hidden="true" />
            <span className="sr-only">{t.nav.language}</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label={t.nav.theme}
            className="rounded-full transition-all duration-300 ease-in-out hover:scale-110 hover:bg-primary/10"
          >
            <Sun
              className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
              aria-hidden="true"
            />
            <Moon
              className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
              aria-hidden="true"
            />
            <span className="sr-only">{t.nav.theme}</span>
          </Button>
        </div>
      </nav>
    </header>
  );
};
