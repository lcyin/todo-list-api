#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const envFile = process.env.NODE_ENV === "test" ? ".env.test" : ".env";
require("dotenv").config({
  path: envFile,
});

/**
 * Migration script to run SQL files in the migrations folder
 * Runs all .sql files in numerical order based on filename
 */

// Database configuration from environment variables
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || "25434",
  database: process.env.DB_NAME || "todolist_test",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "password",
};

// Build PostgreSQL connection string
const connectionString = `postgresql://${dbConfig.user}:${dbConfig.password}@${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`;

// Path to migrations folder
const migrationsPath = path.join(__dirname, "..", "src", "db", "migrations");

/**
 * Get all SQL files in the migrations folder, sorted by filename
 * @returns {string[]} Array of migration file paths
 */
function getMigrationFiles() {
  try {
    const files = fs
      .readdirSync(migrationsPath)
      .filter(file => file.endsWith(".sql"))
      .sort() // This will sort files like 001-xxx.sql, 002-xxx.sql
      .map(file => path.join(migrationsPath, file));

    return files;
  } catch (error) {
    console.error("❌ Error reading migrations folder:", error.message);
    process.exit(1);
  }
}

/**
 * Execute a single SQL file
 * @param {string} filePath - Path to the SQL file
 */
function executeSqlFile(filePath) {
  const fileName = path.basename(filePath);
  console.log(`📄 Executing migration: ${fileName}`);

  try {
    // Use psql to execute the SQL file
    execSync(`psql "${connectionString}" -f "${filePath}"`, {
      stdio: "inherit",
      env: { ...process.env, PGPASSWORD: dbConfig.password },
    });
    console.log(`✅ Successfully executed: ${fileName}`);
  } catch (error) {
    console.error(`❌ Error executing ${fileName}:`, error.message);
    process.exit(1);
  }
}

/**
 * Main migration function
 */
function runMigrations() {
  console.log("🚀 Starting database migrations...");
  console.log(`🔗 Connecting to: ${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`);

  // Check if psql is available
  try {
    execSync("which psql", { stdio: "ignore" });
  } catch (error) {
    console.error("❌ psql command not found. Please install PostgreSQL client tools.");
    console.error("   On Ubuntu/Debian: sudo apt-get install postgresql-client");
    console.error("   On macOS: brew install postgresql");
    process.exit(1);
  }

  // Get all migration files
  const migrationFiles = getMigrationFiles();

  if (migrationFiles.length === 0) {
    console.log("ℹ️  No migration files found in:", migrationsPath);
    return;
  }

  console.log(`📁 Found ${migrationFiles.length} migration file(s):`);
  migrationFiles.forEach(file => console.log(`   - ${path.basename(file)}`));
  console.log("");

  // Execute each migration file in order
  migrationFiles.forEach(executeSqlFile);

  console.log("🎉 All migrations completed successfully!");
}

// Handle command line arguments
const args = process.argv.slice(2);
if (args.includes("--help") || args.includes("-h")) {
  console.log(`
Database Migration Tool

Usage:
  npm run migrate           # Run all migration files
  node scripts/migrate.js   # Direct execution

Environment Variables:
  DB_HOST      # Database host (default: localhost)
  DB_PORT      # Database port (default: 5432)
  DB_NAME      # Database name (default: todolist)
  DB_USER      # Database user (default: todouser)
  DB_PASSWORD  # Database password (default: todopass)

Migration files should be placed in src/db/migrations/ and named with
a numeric prefix for ordering (e.g., 001-create-tables.sql, 002-seed-data.sql)
`);
  process.exit(0);
}

// Run migrations
runMigrations();
