import fs from "fs";
import path from "path";
import { config } from "./index";

/**
 * Auto-generated Swagger configuration
 * Uses swagger-autogen to generate documentation automatically
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let swaggerDocument: any = {};

// Try to load the auto-generated swagger.json file
try {
  const swaggerPath = path.join(__dirname, "../../swagger/swagger.json");
  if (fs.existsSync(swaggerPath)) {
    const swaggerContent = fs.readFileSync(swaggerPath, "utf8");
    swaggerDocument = JSON.parse(swaggerContent);

    // Update the host if it's not already set correctly
    if (swaggerDocument.host === "localhost:3000") {
      swaggerDocument.host = `localhost:${config.server.port}`;
    }

    // Add production server if not in development
    if (!config.isDevelopment && swaggerDocument.servers) {
      swaggerDocument.servers = [
        {
          url: `http://localhost:${config.server.port}`,
          description: "Development server",
        },
        {
          url: "https://api.todolist.com",
          description: "Production server",
        },
      ];
    }
  } else {
    console.warn(
      "Swagger documentation file not found. Run 'npm run swagger:generate' to generate it."
    );
    // Fallback minimal swagger document
    swaggerDocument = {
      openapi: "3.0.0",
      info: {
        title: "Todo List API",
        version: "1.0.0",
        description:
          "Auto-generated documentation not available. Run 'npm run swagger:generate' to generate documentation.",
      },
      paths: {},
    };
  }
} catch (error) {
  console.error("Error loading swagger documentation:", error);
  // Fallback minimal swagger document
  swaggerDocument = {
    openapi: "3.0.0",
    info: {
      title: "Todo List API",
      version: "1.0.0",
      description:
        "Error loading auto-generated documentation. Run 'npm run swagger:generate' to generate documentation.",
    },
    paths: {},
  };
}

export { swaggerDocument as swaggerSpec };
