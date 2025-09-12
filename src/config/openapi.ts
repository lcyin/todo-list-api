import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
} from "@asteasolutions/zod-to-openapi";
import { registerAuthRoutes, registerTodoRoutes } from "./openapi-routes";

// Create the registry
export const registry = new OpenAPIRegistry();

// Define common components
registry.registerComponent("securitySchemes", "bearerAuth", {
  type: "http",
  scheme: "bearer",
  bearerFormat: "JWT",
});

// Register all routes
registerAuthRoutes(registry);
registerTodoRoutes(registry);

// Generate the OpenAPI document
export function generateOpenAPIDocument() {
  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "Todo List API",
      description:
        "A RESTful API for managing todo items with user authentication",
      contact: {
        name: "API Support",
        email: "support@todoapi.com",
      },
      license: {
        name: "ISC",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
      {
        url: "https://api.todolist.com",
        description: "Production server",
      },
    ],
    security: [
      {
        bearerAuth: [],
      },
    ],
    tags: [
      {
        name: "Authentication",
        description: "User authentication endpoints",
      },
      {
        name: "Todos",
        description: "Todo management endpoints",
      },
    ],
  });
}
