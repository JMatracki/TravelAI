import { STORAGE_KEYS } from "@/lib/config/constants";

export { getStoredItineraries, setStoredItineraries } from "./itinerary";

export {
  getStoredTheme,
  setStoredTheme,
  getStoredLanguage,
  setStoredLanguage,
} from "./preferences";

export const clearAllStoredData = (): boolean => {
  try {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
    return true;
  } catch (error) {
    console.error("Failed to clear stored data:", error);
    return false;
  }
};
