import dotenv from "dotenv";
import path from "path";

export interface EnvironmentConfig {
  nodeEnv: string;
  port: number;
  database: {
    host: string;
    port: number;
    name: string;
    user: string;
    password: string;
    ssl: boolean;
  };
  logging: {
    level: string;
    silent: boolean;
  };
  test: {
    timeout: number;
    verbose: boolean;
  };
}

export const loadEnvironmentConfig = (): EnvironmentConfig => {
  const nodeEnv = process.env.NODE_ENV || "development";

  const envFile =
    process.env.NODE_ENV === "development" ? ".env" : `.env.${nodeEnv}`;
  const envPath = path.resolve(process.cwd(), envFile);

  // Load environment-specific .env file
  dotenv.config({ path: envPath });

  // Ensure the environment file exists before loading
  if (!require("fs").existsSync(envPath)) {
    throw new Error(
      `Environment file ${envFile} not found at path: ${envPath}`
    );
  }
  dotenv.config({ path: envPath });
  console.log(`✅ Loaded ${envFile}`);
  const isTest = nodeEnv === "test";
  const isProduction = nodeEnv === "production";

  return {
    nodeEnv,
    port: parseInt(process.env.PORT || "3000"),
    database: {
      host: process.env.DB_HOST || "localhost",
      port: parseInt(process.env.DB_PORT || "5432"),
      name: process.env.DB_NAME || "todo_list-test",
      user: process.env.DB_USER || "postgres",
      password: process.env.DB_PASSWORD || "",
      ssl: process.env.DB_SSL === "true" || false,
    },
    logging: {
      level: process.env.LOG_LEVEL || "error",
      silent: isTest && process.env.JEST_VERBOSE !== "true",
    },
    test: {
      timeout: parseInt(process.env.TEST_TIMEOUT || "30000"),
      verbose: process.env.JEST_VERBOSE === "true",
    },
  };
};

export const config = loadEnvironmentConfig();
