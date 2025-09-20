import { pool } from "../config/database";
import * as fs from "fs";
import * as path from "path";
import logger from "../loggers/logger";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Create migrations tracking table if it doesn't exist
const createMigrationsTable = async (): Promise<void> => {
  try {
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await pool.query(createTableSQL);
    logger.info("Migrations tracking table ensured");
  } catch (error) {
    logger.error("Failed to create migrations table", {
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw error;
  }
};

// Get list of already executed migrations
const getExecutedMigrations = async (): Promise<string[]> => {
  try {
    const result = await pool.query(
      "SELECT filename FROM migrations ORDER BY executed_at"
    );
    return result.rows.map((row) => row.filename);
  } catch (error) {
    logger.error("Failed to get executed migrations", {
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw error;
  }
};

const runMigrations = async (): Promise<void> => {
  try {
    // First test the database connection
    logger.info("Testing database connection...");
    await pool.query("SELECT 1");
    logger.info("✅ Database connection successful");

    // Ensure migrations tracking table exists
    await createMigrationsTable();

    const migrationsDir = path.join(__dirname, "../../migrations");

    // Check if migrations directory exists
    if (!fs.existsSync(migrationsDir)) {
      const error = `Migrations directory not found: ${migrationsDir}`;
      logger.error("Migrations directory does not exist", {
        path: migrationsDir,
        absolutePath: path.resolve(migrationsDir),
      });
      throw new Error(error);
    }

    const migrationFiles = fs
      .readdirSync(migrationsDir)
      .filter((file) => file.endsWith(".sql"))
      .sort((a, b) => a.localeCompare(b));

    logger.info("Found migration files", {
      directory: migrationsDir,
      files: migrationFiles,
      count: migrationFiles.length,
    });

    if (migrationFiles.length === 0) {
      logger.info("No migration files found");
      return;
    }

    // Get list of already executed migrations
    const executedMigrations = await getExecutedMigrations();

    // Filter out already executed migrations
    const pendingMigrations = migrationFiles.filter(
      (file) => !executedMigrations.includes(file)
    );

    if (pendingMigrations.length === 0) {
      logger.info("All migrations have already been executed", {
        totalMigrations: migrationFiles.length,
        executedMigrations: executedMigrations.length,
      });
      return;
    }

    logger.info("Starting database migrations...", {
      totalMigrations: migrationFiles.length,
      executedMigrations: executedMigrations.length,
      pendingMigrations: pendingMigrations.length,
      files: pendingMigrations,
    });

    for (const file of pendingMigrations) {
      const migrationPath = path.join(migrationsDir, file);

      logger.info(`Reading migration file: ${file}`, {
        path: migrationPath,
      });

      if (!fs.existsSync(migrationPath)) {
        throw new Error(`Migration file not found: ${migrationPath}`);
      }

      const migrationSQL = fs.readFileSync(migrationPath, "utf8");

      logger.info(`Running migration: ${file}`, {
        sqlLength: migrationSQL.length,
      });

      // Run migration in a transaction
      const client = await pool.connect();
      try {
        await client.query("BEGIN");
        await client.query(migrationSQL);
        await client.query("INSERT INTO migrations (filename) VALUES ($1)", [
          file,
        ]);
        await client.query("COMMIT");
        logger.info(`✅ Migration completed: ${file}`);
      } catch (error) {
        await client.query("ROLLBACK");
        logger.error(`❌ Migration failed: ${file}`, {
          error: error instanceof Error ? error.message : "Unknown error",
          stack: error instanceof Error ? error.stack : undefined,
          sqlPreview: migrationSQL.substring(0, 200) + "...",
        });
        throw error;
      } finally {
        client.release();
      }
    }

    logger.info("All migrations completed successfully", {
      newMigrationsRun: pendingMigrations.length,
    });
  } catch (error) {
    logger.error("Migration failed", {
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw error;
  }
};

// Run migrations if this file is executed directly
if (require.main === module) {
  runMigrations()
    .then(() => {
      logger.info("Migration process completed successfully");
      process.exit(0);
    })
    .catch((error) => {
      logger.error("Migration process failed", {
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      });
      process.exit(1);
    });
}

export { runMigrations };
