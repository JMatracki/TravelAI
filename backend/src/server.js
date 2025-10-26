import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { generateItinerary } from "./services/openaiService.js";
import { RATE_LIMIT_CONFIG, SERVER_CONFIG, REQUEST_LIMITS } from "./config.js";

const app = express();
const PORT = SERVER_CONFIG.PORT;

app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  })
);

app.use(
  cors({
    origin: SERVER_CONFIG.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

const limiter = rateLimit({
  windowMs: RATE_LIMIT_CONFIG.WINDOW_MS,
  max: RATE_LIMIT_CONFIG.MAX_REQUESTS,
  message: {
    error: RATE_LIMIT_CONFIG.MESSAGE,
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api/", limiter);

app.use(express.json({ limit: REQUEST_LIMITS.JSON_LIMIT }));
app.use(
  express.urlencoded({
    extended: true,
    limit: REQUEST_LIMITS.URL_ENCODED_LIMIT,
  })
);

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

app.post("/api/generate-itinerary", async (req, res) => {
  try {
    const result = await generateItinerary(req.body);
    res.json(result);
  } catch (error) {
    console.error("Error generating itinerary:", error);

    if (error.message.includes("quota exceeded")) {
      return res.status(429).json({
        error: "API quota exceeded. Please try again later.",
      });
    }

    if (error.message.includes("Invalid API key")) {
      return res.status(401).json({
        error: "Invalid API configuration.",
      });
    }

    if (error.message.includes("Rate limit exceeded")) {
      return res.status(429).json({
        error: "Rate limit exceeded. Please try again later.",
      });
    }

    if (
      error.message.includes("required") ||
      error.message.includes("must be")
    ) {
      return res.status(400).json({
        error: error.message,
      });
    }

    res.status(500).json({
      error: "Failed to generate itinerary. Please try again.",
    });
  }
});

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    error: "Internal server error",
  });
});

app.use("*", (req, res) => {
  res.status(404).json({
    error: "Endpoint not found",
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🌍 CORS enabled for: ${SERVER_CONFIG.FRONTEND_URL}`);
  console.log(`⚡ Environment: ${SERVER_CONFIG.NODE_ENV}`);
});

export default app;
