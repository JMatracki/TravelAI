import OpenAI from "openai";
import { OPENAI_CONFIG } from "../config.js";
import { generateTravelPrompt } from "../prompts/travelPrompts.js";
import {
  validateTravelFormData,
  ValidationError,
} from "../utils/validation.js";
import { extractTripCost } from "../utils/costExtractor.js";

const openai = new OpenAI({
  apiKey: OPENAI_CONFIG.API_KEY,
});

const API_CONFIG = {
  MODEL: OPENAI_CONFIG.MODEL,
  MAX_TOKENS: OPENAI_CONFIG.MAX_TOKENS,
  TEMPERATURE: OPENAI_CONFIG.TEMPERATURE,
};

/**
 * Generate unique itinerary ID
 * @returns {string} Unique identifier for the itinerary
 */
const generateItineraryId = () => {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substr(2, 9);
  return `itinerary_${timestamp}_${randomStr}`;
};

/**
 * Make OpenAI API call to generate itinerary content
 * @param {string} prompt - User prompt for itinerary generation
 * @param {string} systemPrompt - System instructions for AI
 * @returns {Promise<string>} Generated itinerary content
 * @throws {Error} When API call fails
 */
const callOpenAI = async (prompt, systemPrompt) => {
  try {
    const completion = await openai.chat.completions.create({
      model: API_CONFIG.MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      max_tokens: API_CONFIG.MAX_TOKENS,
      temperature: API_CONFIG.TEMPERATURE,
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      throw new Error("No content received from OpenAI");
    }

    return content;
  } catch (error) {
    console.error("OpenAI API Error:", error);

    switch (error.code) {
      case "insufficient_quota":
        throw new Error(
          "OpenAI API quota exceeded. Please check your billing."
        );
      case "invalid_api_key":
        throw new Error(
          "Invalid OpenAI API key. Please check your configuration."
        );
      case "rate_limit_exceeded":
        throw new Error("Rate limit exceeded. Please try again later.");
      default:
        throw new Error(`Failed to generate itinerary: ${error.message}`);
    }
  }
};

/**
 * Build itinerary response object
 * @param {Object} validatedData - Validated form data
 * @param {string} content - Generated itinerary content
 * @returns {Object} Complete itinerary response
 */
const buildItineraryResponse = (validatedData, content) => {
  const estimatedCost = extractTripCost(content);

  return {
    id: generateItineraryId(),
    destination: validatedData.destination,
    days: validatedData.days,
    content,
    estimatedCost,
    createdAt: new Date().toISOString(),
  };
};

/**
 * Generate travel itinerary using OpenAI
 *
 * @param {Object} formData - Form data containing travel preferences
 * @param {string} formData.destination - Travel destination
 * @param {number} formData.days - Number of travel days
 * @param {string} formData.activities - Preferred activities and interests
 * @param {string} formData.language - Language preference ('en' or 'pl')
 * @returns {Promise<Object>} Generated itinerary with metadata
 * @throws {ValidationError} When input validation fails
 * @throws {Error} When itinerary generation fails
 *
 * @example
 * const itinerary = await generateItinerary({
 *   destination: "Tokyo, Japan",
 *   days: 7,
 *   activities: "temples, food, shopping",
 *   language: "en"
 * });
 */
export const generateItinerary = async (formData) => {
  const validatedData = validateTravelFormData(formData);

  const { destination, days, activities, language } = validatedData;

  const { prompt, systemPrompt } = generateTravelPrompt(
    destination,
    days,
    activities,
    language
  );

  const content = await callOpenAI(prompt, systemPrompt);

  return buildItineraryResponse(validatedData, content);
};
