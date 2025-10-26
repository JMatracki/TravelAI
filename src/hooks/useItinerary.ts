import { useState, useCallback } from "react";
import { apiService } from "@/lib/api/apiService";
import type { TripFormData, Itinerary } from "@/types/itinerary";

const useItinerary = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Itinerary | null>(null);

  const generateItinerary = useCallback(async (formData: TripFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await apiService.generateItinerary(formData);
      setData(result);
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to generate itinerary";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearData = useCallback(() => {
    setData(null);
  }, []);

  return {
    isLoading,
    error,
    data,
    generateItinerary,
    clearError,
    clearData,
  };
};

export { useItinerary };
