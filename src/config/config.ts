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
