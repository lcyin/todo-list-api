import { Pool, PoolConfig } from "pg";
import logger from "./../loggers/logger";
import { envConfig } from "./config";

interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  ssl: boolean;
}

const getDatabaseConfig = (): DatabaseConfig => {
  return {
    host: envConfig.database.host,
    port: envConfig.database.port,
    database: envConfig.database.name,
    user: envConfig.database.user,
    password: envConfig.database.password,
    ssl: envConfig.database.ssl,
  };
};

const config = getDatabaseConfig();
const isTest = envConfig.nodeEnv === "test";

// Only log database config in non-test environments
if (!isTest) {
  logger.info("Database configuration", {
    environment: envConfig.nodeEnv,
    host: config.host,
    port: config.port,
    database: config.database,
    user: config.user,
    ssl: config.ssl,
    password: config.password ? "✅ Yes" : "❌ No",
  });
}

// Determine pool size based on environment
const getPoolSize = () => {
  if (isTest) return 5;
  if (envConfig.nodeEnv === "production") return 50;
  return 20;
};

const poolConfig: PoolConfig = {
  ...config,
  // Environment-specific pool settings
  max: getPoolSize(),
  idleTimeoutMillis: isTest ? 1000 : 30000,
  connectionTimeoutMillis: isTest ? 1000 : 2000,
};

export const pool = new Pool(poolConfig);

// Test database connection
export const testConnection = async (): Promise<void> => {
  try {
    const client = await pool.connect();
    if (!isTest) {
      logger.info("✅ Database connection successful", {
        host: config.host,
        port: config.port,
        database: config.database,
        environment: envConfig.nodeEnv,
      });
    }
    client.release();
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    logger.error("❌ Database connection failed", {
      error: errorMessage,
      environment: envConfig.nodeEnv,
      config: { ...config, password: "***" },
    });
    throw error;
  }
};

// Graceful shutdown
export const closePool = async (): Promise<void> => {
  try {
    await pool.end();
    if (!isTest) {
      logger.info("Database pool closed");
    }
  } catch (error) {
    logger.error("Error closing database pool", { error });
  }
};

// Export config for testing purposes
export const getDatabaseConfigForTesting = () => config;
