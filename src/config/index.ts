import dotenv from "dotenv";

// Load environment variables from appropriate .env file based on NODE_ENV
const envFile = process.env.NODE_ENV === "test" ? ".env.test" : ".env";
dotenv.config({ path: envFile });

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
   * Database configuration
   */
  database: {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432", 10),
    name: process.env.DB_NAME || "todolist",
    user: process.env.DB_USER || "todouser",
    password: process.env.DB_PASSWORD || "todopass",
    ssl: process.env.DB_SSL === "true",
    maxConnections: parseInt(process.env.DB_MAX_CONNECTIONS || "10", 10),
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
