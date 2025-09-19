import {
  testConnection,
  getDatabaseConfigForTesting,
  closePool,
} from "../../config/database";

const testDatabaseConnection = async () => {
  try {
    console.log("🔍 Testing database connection...");
    console.log("Environment:", process.env.NODE_ENV);

    const config = getDatabaseConfigForTesting();
    console.table({
      Host: config.host,
      Port: config.port,
      Database: config.database,
      User: config.user,
      "Password Set": config.password ? "✅ Yes" : "❌ No",
      SSL: config.ssl,
    });

    await testConnection();
    console.log("✅ Database connection successful!");
  } catch (error) {
    console.error("❌ Database connection failed:");
    console.error(error instanceof Error ? error.message : error);

    if (error instanceof Error) {
      if (error.message.includes("ECONNREFUSED")) {
        console.log("\n💡 Connection refused. Please check:");
        console.log("1. PostgreSQL is running");
        console.log("2. Database exists");
        console.log("3. Connection details are correct");
      }

      if (error.message.includes("authentication")) {
        console.log("\n💡 Authentication failed. Please check:");
        console.log("1. Username and password are correct");
        console.log("2. User has access to the database");
      }

      if (
        error.message.includes("database") &&
        error.message.includes("does not exist")
      ) {
        console.log("\n💡 Database does not exist. Run:");
        console.log(
          "npm run migrate:test  # to create and migrate test database"
        );
      }
    }

    process.exit(1);
  } finally {
    await closePool();
  }
};

testDatabaseConnection();
