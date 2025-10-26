import { useState, useCallback, useEffect } from "react";
import { getStoredItineraries, setStoredItineraries } from "@/lib/storage";
import type { Itinerary } from "@/types/itinerary";

export const useSavedItineraries = () => {
  const [itineraries, setItineraries] = useState<Itinerary[]>(() => {
    return getStoredItineraries();
  });

  // Sync with localStorage changes (for multiple tabs)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "travel-itineraries") {
        setItineraries(getStoredItineraries());
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const saveItinerary = useCallback(
    (itinerary: Itinerary): boolean => {
      const updated = [...itineraries, itinerary];
      const success = setStoredItineraries(updated);

      if (success) {
        setItineraries(updated);
      }

      return success;
    },
    [itineraries]
  );

  const deleteItinerary = useCallback(
    (id: string): boolean => {
      const updated = itineraries.filter((i) => i.id !== id);
      const success = setStoredItineraries(updated);

      if (success) {
        setItineraries(updated);
      }

      return success;
    },
    [itineraries]
  );

  const clearAllItineraries = useCallback((): boolean => {
    const success = setStoredItineraries([]);

    if (success) {
      setItineraries([]);
    }

    return success;
  }, []);

  return {
    itineraries,
    saveItinerary,
    deleteItinerary,
    clearAllItineraries,
  };
};
