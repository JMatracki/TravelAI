export const SUPPORTED_LANGUAGES = ["en", "pl"];

export const CONSTRAINTS = {
  MIN_DAYS: 1,
  MAX_DAYS: 30,
  MIN_DESTINATION_LENGTH: 1,
  MAX_DESTINATION_LENGTH: 100,
  MIN_ACTIVITIES_LENGTH: 1,
  MAX_ACTIVITIES_LENGTH: 500,
};

export class ValidationError extends Error {
  constructor(message, field = null) {
    super(message);
    this.name = "ValidationError";
    this.field = field;
  }
}

/**
 * Validate and sanitize form data for travel itinerary generation
 *
 * @param {Object} formData - Raw form data from request
 * @param {string} formData.destination - Travel destination
 * @param {number} formData.days - Number of travel days
 * @param {string} formData.activities - Preferred activities
 * @param {string} formData.language - Language preference
 * @returns {Object} Validated and sanitized form data
 * @throws {ValidationError} When validation fails
 */
export const validateTravelFormData = (formData) => {
  if (!formData || typeof formData !== "object") {
    throw new ValidationError("Invalid form data provided");
  }

  const { destination, days, activities, language } = formData;

  if (!destination || typeof destination !== "string") {
    throw new ValidationError(
      "Destination is required and must be a string",
      "destination"
    );
  }

  const cleanDestination = destination.trim();
  if (cleanDestination.length < CONSTRAINTS.MIN_DESTINATION_LENGTH) {
    throw new ValidationError("Destination cannot be empty", "destination");
  }

  if (cleanDestination.length > CONSTRAINTS.MAX_DESTINATION_LENGTH) {
    throw new ValidationError(
      `Destination cannot exceed ${CONSTRAINTS.MAX_DESTINATION_LENGTH} characters`,
      "destination"
    );
  }

  if (!days || typeof days !== "number") {
    throw new ValidationError("Days must be a number", "days");
  }

  if (days < CONSTRAINTS.MIN_DAYS || days > CONSTRAINTS.MAX_DAYS) {
    throw new ValidationError(
      `Days must be between ${CONSTRAINTS.MIN_DAYS} and ${CONSTRAINTS.MAX_DAYS}`,
      "days"
    );
  }

  if (!activities || typeof activities !== "string") {
    throw new ValidationError(
      "Activities are required and must be a string",
      "activities"
    );
  }

  const cleanActivities = activities.trim();
  if (cleanActivities.length < CONSTRAINTS.MIN_ACTIVITIES_LENGTH) {
    throw new ValidationError(
      "Activities description cannot be empty",
      "activities"
    );
  }

  if (cleanActivities.length > CONSTRAINTS.MAX_ACTIVITIES_LENGTH) {
    throw new ValidationError(
      `Activities description cannot exceed ${CONSTRAINTS.MAX_ACTIVITIES_LENGTH} characters`,
      "activities"
    );
  }

  if (!language || !SUPPORTED_LANGUAGES.includes(language)) {
    throw new ValidationError(
      `Language must be one of: ${SUPPORTED_LANGUAGES.join(", ")}`,
      "language"
    );
  }

  return {
    destination: cleanDestination,
    days: Math.floor(days),
    activities: cleanActivities,
    language: language,
  };
};
