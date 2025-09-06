const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "Todo List API",
    version: "1.0.0",
    description:
      "A RESTful API for managing todo lists and tasks built with TypeScript and Express",
    contact: {
      name: "API Support",
      email: "support@todoapi.com",
    },
    license: {
      name: "MIT",
      url: "https://opensource.org/licenses/MIT",
    },
  },
  host: "localhost:3000",
  basePath: "/api/v1", // Set the base path for all routes
  schemes: ["http", "https"],
  consumes: ["application/json"],
  produces: ["application/json"],
  tags: [
    {
      name: "Health",
      description: "Health check endpoints",
    },
    {
      name: "Todos",
      description: "Todo management endpoints",
    },
  ],
  securityDefinitions: {},
  definitions: {
    Todo: {
      type: "object",
      required: ["id", "title", "completed", "createdAt", "updatedAt"],
      properties: {
        id: {
          type: "string",
          format: "uuid",
          description: "Unique identifier for the todo",
          example: "123e4567-e89b-12d3-a456-426614174000",
        },
        title: {
          type: "string",
          minLength: 1,
          maxLength: 255,
          description: "The todo title",
          example: "Complete API documentation",
        },
        description: {
          type: "string",
          maxLength: 1000,
          description: "Optional detailed description",
          example: "Write comprehensive API documentation using Swagger",
        },
        completed: {
          type: "boolean",
          description: "Whether the todo is completed",
          example: false,
        },
        priority: {
          type: "string",
          enum: ["low", "medium", "high"],
          description: "Priority level of the todo",
          example: "medium",
        },
        dueDate: {
          type: "string",
          format: "date-time",
          description: "Optional due date for the todo",
          example: "2024-12-31T23:59:59Z",
        },
        createdAt: {
          type: "string",
          format: "date-time",
          description: "When the todo was created",
          example: "2024-01-01T00:00:00Z",
        },
        updatedAt: {
          type: "string",
          format: "date-time",
          description: "When the todo was last updated",
          example: "2024-01-01T00:00:00Z",
        },
      },
    },
    CreateTodoRequest: {
      type: "object",
      required: ["title"],
      properties: {
        title: {
          type: "string",
          minLength: 1,
          maxLength: 255,
          description: "The todo title",
          example: "Complete API documentation",
        },
        description: {
          type: "string",
          maxLength: 1000,
          description: "Optional detailed description",
          example: "Write comprehensive API documentation using Swagger",
        },
        priority: {
          type: "string",
          enum: ["low", "medium", "high"],
          description: "Priority level of the todo",
          example: "medium",
        },
        dueDate: {
          type: "string",
          format: "date-time",
          description: "Optional due date for the todo",
          example: "2024-12-31T23:59:59Z",
        },
      },
    },
    UpdateTodoRequest: {
      type: "object",
      properties: {
        title: {
          type: "string",
          minLength: 1,
          maxLength: 255,
          description: "The todo title",
          example: "Complete API documentation",
        },
        description: {
          type: "string",
          maxLength: 1000,
          description: "Optional detailed description",
          example: "Write comprehensive API documentation using Swagger",
        },
        completed: {
          type: "boolean",
          description: "Whether the todo is completed",
          example: false,
        },
        priority: {
          type: "string",
          enum: ["low", "medium", "high"],
          description: "Priority level of the todo",
          example: "medium",
        },
        dueDate: {
          type: "string",
          format: "date-time",
          description: "Optional due date for the todo",
          example: "2024-12-31T23:59:59Z",
        },
      },
    },
    TodosResponse: {
      type: "object",
      properties: {
        data: {
          type: "array",
          items: {
            $ref: "#/definitions/Todo",
          },
        },
        pagination: {
          type: "object",
          properties: {
            currentPage: {
              type: "integer",
              description: "Current page number",
              example: 1,
            },
            totalPages: {
              type: "integer",
              description: "Total number of pages",
              example: 5,
            },
            totalItems: {
              type: "integer",
              description: "Total number of items",
              example: 45,
            },
            itemsPerPage: {
              type: "integer",
              description: "Number of items per page",
              example: 10,
            },
            hasNextPage: {
              type: "boolean",
              description: "Whether there is a next page",
              example: true,
            },
            hasPreviousPage: {
              type: "boolean",
              description: "Whether there is a previous page",
              example: false,
            },
          },
        },
      },
    },
    HealthResponse: {
      type: "object",
      properties: {
        status: {
          type: "string",
          description: "Health status",
          example: "healthy",
        },
        timestamp: {
          type: "string",
          format: "date-time",
          description: "Current timestamp",
          example: "2024-01-01T00:00:00.000Z",
        },
        message: {
          type: "string",
          description: "Health check message",
          example: "Todo List API is running",
        },
        database: {
          type: "object",
          properties: {
            status: {
              type: "string",
              description: "Database connection status",
              example: "connected",
            },
            responseTime: {
              type: "number",
              description: "Database response time in milliseconds",
              example: 23.45,
            },
          },
        },
      },
    },
    ErrorResponse: {
      type: "object",
      properties: {
        error: {
          type: "object",
          properties: {
            code: {
              type: "string",
              description: "Error code",
              example: "TODO_NOT_FOUND",
            },
            message: {
              type: "string",
              description: "Error message",
              example: "Todo not found",
            },
            details: {
              type: "object",
              description: "Additional error details",
            },
          },
        },
      },
    },
  },
};

const outputFile = "./swagger/swagger.json";
const endpointsFiles = [
  "./src/controllers/todoController.ts", // Scan controllers for inline comments
  "./src/controllers/healthController.ts",
];

// Generate swagger.json
swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log("Swagger documentation generated successfully!");
  console.log(`Output file: ${outputFile}`);

  // Post-process the generated file to add the correct paths
  const fs = require("fs");
  const path = require("path");

  try {
    const swaggerFilePath = path.resolve(outputFile);
    const swaggerData = JSON.parse(fs.readFileSync(swaggerFilePath, "utf8"));

    // Add custom paths that swagger-autogen couldn't detect
    swaggerData.paths = {
      "/health": {
        get: {
          tags: ["Health"],
          summary: "Get application health status",
          description:
            "Returns the health status of the application for monitoring and load balancing",
          responses: {
            200: {
              description: "Application is healthy",
              schema: { $ref: "#/definitions/HealthResponse" },
            },
            500: {
              description: "Internal server error",
              schema: { $ref: "#/definitions/ErrorResponse" },
            },
          },
        },
      },
      "/health/readiness": {
        get: {
          tags: ["Health"],
          summary: "Get application readiness status",
          description: "Kubernetes readiness probe endpoint",
          responses: {
            200: {
              description: "Application is ready",
              schema: { $ref: "#/definitions/HealthResponse" },
            },
            500: {
              description: "Internal server error",
              schema: { $ref: "#/definitions/ErrorResponse" },
            },
          },
        },
      },
      "/health/liveness": {
        get: {
          tags: ["Health"],
          summary: "Get application liveness status",
          description: "Kubernetes liveness probe endpoint",
          responses: {
            200: {
              description: "Application is alive",
              schema: { $ref: "#/definitions/HealthResponse" },
            },
            500: {
              description: "Internal server error",
              schema: { $ref: "#/definitions/ErrorResponse" },
            },
          },
        },
      },
      "/todos": {
        get: {
          tags: ["Todos"],
          summary: "Get all todos",
          description: "Retrieve a paginated list of todos with optional filtering",
          parameters: [
            {
              name: "page",
              in: "query",
              type: "integer",
              minimum: 1,
              default: 1,
              description: "Page number for pagination",
            },
            {
              name: "limit",
              in: "query",
              type: "integer",
              minimum: 1,
              maximum: 100,
              default: 10,
              description: "Number of items per page",
            },
            {
              name: "completed",
              in: "query",
              type: "boolean",
              description: "Filter by completion status",
            },
            {
              name: "search",
              in: "query",
              type: "string",
              description: "Search in title and description",
            },
          ],
          responses: {
            200: {
              description: "List of todos retrieved successfully",
              schema: { $ref: "#/definitions/TodosResponse" },
            },
            400: {
              description: "Bad request",
              schema: { $ref: "#/definitions/ErrorResponse" },
            },
            500: {
              description: "Internal server error",
              schema: { $ref: "#/definitions/ErrorResponse" },
            },
          },
        },
        post: {
          tags: ["Todos"],
          summary: "Create a new todo",
          description: "Create a new todo item with title and optional description",
          parameters: [
            {
              name: "body",
              in: "body",
              required: true,
              schema: { $ref: "#/definitions/CreateTodoRequest" },
            },
          ],
          responses: {
            201: {
              description: "Todo created successfully",
              schema: { $ref: "#/definitions/Todo" },
            },
            400: {
              description: "Bad request",
              schema: { $ref: "#/definitions/ErrorResponse" },
            },
            500: {
              description: "Internal server error",
              schema: { $ref: "#/definitions/ErrorResponse" },
            },
          },
        },
      },
      "/todos/{id}": {
        get: {
          tags: ["Todos"],
          summary: "Get a todo by ID",
          description: "Retrieve a specific todo by its unique identifier",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              type: "string",
              description: "Unique identifier of the todo",
            },
          ],
          responses: {
            200: {
              description: "Todo retrieved successfully",
              schema: { $ref: "#/definitions/Todo" },
            },
            404: {
              description: "Todo not found",
              schema: { $ref: "#/definitions/ErrorResponse" },
            },
            500: {
              description: "Internal server error",
              schema: { $ref: "#/definitions/ErrorResponse" },
            },
          },
        },
        put: {
          tags: ["Todos"],
          summary: "Update a todo",
          description: "Update an existing todo with new information",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              type: "string",
              description: "Unique identifier of the todo",
            },
            {
              name: "body",
              in: "body",
              required: true,
              schema: { $ref: "#/definitions/UpdateTodoRequest" },
            },
          ],
          responses: {
            200: {
              description: "Todo updated successfully",
              schema: { $ref: "#/definitions/Todo" },
            },
            404: {
              description: "Todo not found",
              schema: { $ref: "#/definitions/ErrorResponse" },
            },
            400: {
              description: "Bad request",
              schema: { $ref: "#/definitions/ErrorResponse" },
            },
            500: {
              description: "Internal server error",
              schema: { $ref: "#/definitions/ErrorResponse" },
            },
          },
        },
        delete: {
          tags: ["Todos"],
          summary: "Delete a todo",
          description: "Delete a specific todo by its unique identifier",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              type: "string",
              description: "Unique identifier of the todo",
            },
          ],
          responses: {
            204: {
              description: "Todo deleted successfully",
            },
            404: {
              description: "Todo not found",
              schema: { $ref: "#/definitions/ErrorResponse" },
            },
            500: {
              description: "Internal server error",
              schema: { $ref: "#/definitions/ErrorResponse" },
            },
          },
        },
      },
    };

    // Write the updated swagger file
    fs.writeFileSync(swaggerFilePath, JSON.stringify(swaggerData, null, 2));
    console.log("Swagger file post-processed successfully!");
  } catch (error) {
    console.error("Error post-processing swagger file:", error);
  }
});
