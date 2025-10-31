import { useRef, useCallback, useEffect } from "react";
import { UI_CONFIG } from "@/lib/config/constants";

export const useScrollToSection = () => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const scrollToElement = useCallback(
    (element: HTMLElement | null, delay = 0) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (!element) return;

      const scroll = () => {
        element.scrollIntoView({
          behavior: UI_CONFIG.SCROLL_BEHAVIOR,
        });
      };

      if (delay > 0) {
        timeoutRef.current = setTimeout(scroll, delay);
      } else {
        scroll();
      }
    },
    []
  );

  return { scrollToElement };
};
