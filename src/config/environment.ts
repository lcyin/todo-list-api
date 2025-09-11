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

  // Load base .env file
  dotenv.config();

  // Load environment-specific .env file
  const envFile = `.env.${nodeEnv}`;
  const envPath = path.resolve(process.cwd(), envFile);

  try {
    dotenv.config({ path: envPath, override: true });
    console.log(`✅ Loaded ${envFile}`);
  } catch (error) {
    console.log(`ℹ️  Using base .env file only`);
  }

  const isTest = nodeEnv === "test";
  const isProduction = nodeEnv === "production";

  return {
    nodeEnv,
    port: parseInt(process.env.PORT || (isTest ? "3001" : "3000")),
    database: {
      host: process.env.DB_HOST || "localhost",
      port: parseInt(process.env.DB_PORT || "5432"),
      name:
        process.env.DB_NAME ||
        (isTest
          ? "todo_list_test"
          : isProduction
          ? "todo_list_prod"
          : "todo_list"),
      user: process.env.DB_USER || "postgres",
      password: process.env.DB_PASSWORD || "",
      ssl: process.env.DB_SSL === "true" || isProduction,
    },
    logging: {
      level: process.env.LOG_LEVEL || (isTest ? "error" : "debug"),
      silent: isTest && process.env.JEST_VERBOSE !== "true",
    },
    test: {
      timeout: parseInt(process.env.TEST_TIMEOUT || "30000"),
      verbose: process.env.JEST_VERBOSE === "true",
    },
  };
};

export const config = loadEnvironmentConfig();
