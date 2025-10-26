import dotenv from "dotenv";
dotenv.config();

export const RATE_LIMIT_CONFIG = {
  WINDOW_MS: 15 * 60 * 1000,
  MAX_REQUESTS: 10,
  MESSAGE: "Too many requests from this IP, please try again later.",
};

export const SERVER_CONFIG = {
  PORT: process.env.PORT || 3001,
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:5173",
  NODE_ENV: process.env.NODE_ENV || "development",
};

export const OPENAI_CONFIG = {
  API_KEY: process.env.OPENAI_API_KEY,
  MODEL: "gpt-4o-mini",
  MAX_TOKENS: 4000,
  TEMPERATURE: 0.7,
};

export const REQUEST_LIMITS = {
  JSON_LIMIT: "10mb",
  URL_ENCODED_LIMIT: "10mb",
};

const validateEnvironment = () => {
  const requiredVars = {
    OPENAI_API_KEY: OPENAI_CONFIG.API_KEY,
  };

  const missing = Object.entries(requiredVars)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    console.error(
      "❌ Missing required environment variables:",
      missing.join(", ")
    );
    console.error(
      "Please check your .env file and ensure all required variables are set."
    );
    process.exit(1);
  }

  console.log("✅ Environment variables validated successfully");
};

validateEnvironment();

export default {
  RATE_LIMIT_CONFIG,
  SERVER_CONFIG,
  OPENAI_CONFIG,
  REQUEST_LIMITS,
};
