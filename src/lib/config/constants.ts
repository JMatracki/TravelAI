export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || "http://localhost:3001",
  ENDPOINTS: {
    GENERATE_ITINERARY: "/api/generate-itinerary",
    HEALTH_CHECK: "/api/health",
  },
  TIMEOUT: 30000, // 30 seconds
} as const;

export const RATE_LIMIT = {
  WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  MAX_REQUESTS: 10,
} as const;

export const STORAGE_KEYS = {
  ITINERARIES: "travel-itineraries",
  THEME: "vite-ui-theme",
  LANGUAGE: "vite-ui-language",
} as const;

export const FORM_LIMITS = {
  MIN_DAYS: 1,
  MAX_DAYS: 30,
  MAX_DESTINATION_LENGTH: 200,
  MAX_ACTIVITIES_LENGTH: 1000,
} as const;

export const UI_CONFIG = {
  SCROLL_BEHAVIOR: "smooth" as const,
  SCROLL_DELAY: 100, // ms
  TOAST_DURATION: 3000, // ms
  DEBOUNCE_DELAY: 500, // ms
} as const;

export const PDF_CONFIG = {
  PAGE_MARGIN: 20,
  LINE_HEIGHT: 6,
  FONT_SIZE: {
    TITLE: 16,
    SUBTITLE: 12,
    BODY: 10,
    SMALL: 9,
  },
} as const;

export const AI_CONFIG = {
  MAX_TOKENS: 4000,
  TEMPERATURE: 0.7,
  MODEL: "gpt-4o-mini",
} as const;

export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Network error. Please check your connection.",
  AI_SERVICE_ERROR: "AI service is temporarily unavailable.",
  VALIDATION_ERROR: "Please check your input and try again.",
  GENERIC_ERROR: "Something went wrong. Please try again.",
  PDF_EXPORT_ERROR: "Failed to export PDF. Please try again.",
  STORAGE_ERROR: "Failed to save data. Please try again.",
} as const;

export const SUCCESS_MESSAGES = {
  ITINERARY_GENERATED: "Itinerary generated successfully!",
  ITINERARY_SAVED: "Itinerary saved successfully!",
  PDF_EXPORTED: "PDF exported successfully!",
  DATA_CLEARED: "All data cleared successfully!",
} as const;
