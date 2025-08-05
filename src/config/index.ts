import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

/**
 * Application configuration object
 * Centralizes all environment-based configuration settings
 */
export const config = {
  /**
   * Server configuration
   */
  server: {
    port: parseInt(process.env.PORT || "3000", 10),
    nodeEnv: process.env.NODE_ENV || "development",
  },

  /**
   * API configuration
   */
  api: {
    version: process.env.API_VERSION || "v1",
    prefix: "/api",
  },

  /**
   * Check if running in development mode
   */
  isDevelopment: process.env.NODE_ENV === "development",

  /**
   * Check if running in production mode
   */
  isProduction: process.env.NODE_ENV === "production",
} as const;
