import dotenv from "dotenv";
import path from "path";

// Load environment-specific .env files
export const loadEnvironmentConfig = () => {
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
};
loadEnvironmentConfig();

// Application configuration
export const config = {
  // Server
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // JWT Configuration
  jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  
  // Database
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    name: process.env.DB_NAME || 'todo_list',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    ssl: process.env.DB_SSL === 'true',
  },
  
  // Logging
  logLevel: process.env.LOG_LEVEL || 'info',
} as const;

