import { Sparkles, Code } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { useTheme } from "@/hooks/useTheme";
import githubIcon from "@/assets/images/github.png";
import githubIconWhite from "@/assets/images/github_white.png";

export const Footer = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();

  return (
    <footer className="border-t border-glass-border bg-card/50 backdrop-blur-glass py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-2 sm:flex-row justify-between ">
          <div className="flex items-center gap-4 text-sm whitespace-nowrap justify-center sm:justify-normal">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary">
              <Sparkles className="w-4 h-4" />
              {t.footer.powered}
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent">
              <Code className="w-4 h-4" />
              {t.footer.openSource}
            </div>
          </div>
          <a
            className="flex items-center gap-2 justify-center sm:justify-normal"
            href="https://github.com/JMatracki"
            target="_blank"
            rel="noopener noreferrer"
            title="GitHub"
          >
            <img
              className="h-5 w-5"
              alt="GitHub"
              aria-hidden="true"
              src={theme === "dark" ? githubIconWhite : githubIcon}
            />
            <span className="font-semibold">JMatracki</span>
          </a>
        </div>

        <div className="mt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} TravelAI. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
