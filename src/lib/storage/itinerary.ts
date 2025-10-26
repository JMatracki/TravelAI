import { STORAGE_KEYS } from "@/lib/config/constants";
import type { Itinerary } from "@/types/itinerary";

export const getStoredItineraries = (): Itinerary[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.ITINERARIES);
    if (!stored) return [];

    const parsed = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      console.warn("Stored itineraries is not an array, clearing storage");
      localStorage.removeItem(STORAGE_KEYS.ITINERARIES);
      return [];
    }

    const validItineraries = parsed.filter((item: unknown) => {
      return (
        item &&
        typeof (item as Record<string, unknown>).id === "string" &&
        typeof (item as Record<string, unknown>).destination === "string" &&
        typeof (item as Record<string, unknown>).days === "number" &&
        typeof (item as Record<string, unknown>).content === "string"
      );
    });

    if (validItineraries.length !== parsed.length) {
      console.warn("Some stored itineraries were invalid, cleaned up storage");
      setStoredItineraries(validItineraries);
    }

    return validItineraries;
  } catch (error) {
    console.error("Failed to parse stored itineraries:", error);
    localStorage.removeItem(STORAGE_KEYS.ITINERARIES);
    return [];
  }
};

export const setStoredItineraries = (itineraries: Itinerary[]): boolean => {
  try {
    localStorage.setItem(STORAGE_KEYS.ITINERARIES, JSON.stringify(itineraries));
    return true;
  } catch (error) {
    console.error("Failed to store itineraries:", error);
    return false;
  }
};
