import { Pool, PoolConfig } from "pg";
import logger from "./logger";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  ssl?: boolean;
}

const getDatabaseConfig = (): DatabaseConfig => {
  return {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    database: process.env.DB_NAME || "todo_list",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "",
    ssl: process.env.DB_SSL === "true",
  };
};

const config = getDatabaseConfig();

logger.info("Database configuration", {
  host: config.host,
  port: config.port,
  database: config.database,
  user: config.user,
  ssl: config.ssl,
  password: config.password ? "✅ Yes" : "❌ No",
});

const poolConfig: PoolConfig = {
  ...config,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
};

export const pool = new Pool(poolConfig);

// Test database connection
export const testConnection = async (): Promise<void> => {
  try {
    const client = await pool.connect();
    logger.info("✅ Database connection successful", {
      host: config.host,
      port: config.port,
      database: config.database,
    });
    client.release();
  } catch (error) {
    logger.error("❌ Database connection failed", {
      error: error instanceof Error ? error.message : "Unknown error",
      config: { ...config, password: "***" }, // Hide password in logs
    });
    throw error;
  }
};

// Graceful shutdown
export const closePool = async (): Promise<void> => {
  try {
    await pool.end();
    logger.info("Database pool closed");
  } catch (error) {
    logger.error("Error closing database pool", { error });
  }
};
