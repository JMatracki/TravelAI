import type { TripFormData, Itinerary } from "@/types/itinerary";
import { API_CONFIG, ERROR_MESSAGES } from "@/lib/config/constants";

export const apiService = {
  async generateItinerary(formData: TripFormData): Promise<Itinerary> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.GENERATE_ITINERARY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        if (response.status === 429) {
          throw new Error("Rate limit exceeded. Please try again later.");
        }
        if (response.status === 401) {
          throw new Error(
            "Authentication failed. Please check API configuration."
          );
        }
        if (response.status >= 500) {
          throw new Error(ERROR_MESSAGES.AI_SERVICE_ERROR);
        }

        throw new Error(errorData.message || ERROR_MESSAGES.GENERIC_ERROR);
      }

      const data = await response.json();

      if (!data || typeof data !== "object") {
        throw new Error("Invalid response format from server");
      }

      return data;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error && error.name === "AbortError") {
        throw new Error("Request timeout. Please try again.");
      }

      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
      }

      throw error;
    }
  },

  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.HEALTH_CHECK}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.ok;
    } catch (error) {
      console.warn("Health check failed:", error);
      return false;
    }
  },
};
