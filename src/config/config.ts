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
  jwt: {
    jwtSecret: string;
    jwtExpiresIn: string;
    jwtRefreshExpiresIn: string;
  };
}

// Load environment-specific .env files
const loadEnvironmentConfig = () => {
  const nodeEnv = process.env.NODE_ENV || "development";

  // Load base .env file first
  dotenv.config();

  // Load environment-specific .env file if it exists
  const envFile = `.env.${nodeEnv}`;
  const envPath = path.resolve(process.cwd(), envFile);

  try {
    dotenv.config({ path: envPath });
    console.log(`✅ Loaded environment config from ${envFile}`);
  } catch (error) {
    console.log(`ℹ️  No ${envFile} file found, using base .env and defaults`);
  }

  // Application configuration
  const config: EnvironmentConfig = {
    // Server
    port: parseInt(process.env.PORT || "3000", 10),
    nodeEnv: process.env.NODE_ENV || "development",

    // JWT Configuration
    jwt: {
      jwtSecret: process.env.JWT_SECRET || "default_jwt_secret",
      jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1h",
      jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
    },

    // Database
    database: {
      host: process.env.DB_HOST || "localhost",
      port: parseInt(process.env.DB_PORT || "5432", 10),
      name: process.env.DB_NAME || "default_db_name",
      user: process.env.DB_USER || "default_db_user",
      password: process.env.DB_PASSWORD || "default_db_password",
      ssl: process.env.DB_SSL === "true",
    },

    // Logging
    logging: {
      level: process.env.LOG_LEVEL || "info",
      silent: process.env.LOG_SILENT === "true",
    },
    // Testing
    test: {
      timeout: parseInt(process.env.TEST_TIMEOUT || "5000", 10),
      verbose: process.env.TEST_VERBOSE === "true",
    },
  };
  return config;
};

export const envConfig = loadEnvironmentConfig();
export default envConfig;
