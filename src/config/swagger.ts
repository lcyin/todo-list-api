import swaggerJSDoc from "swagger-jsdoc";
import { config } from "./index";

/**
 * Swagger configuration for API documentation
 * Follows OpenAPI 3.0 specification
 */
const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
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
    servers: [
      {
        url: `http://localhost:${config.server.port}`,
        description: "Development server",
      },
      {
        url: "https://api.todolist.com",
        description: "Production server",
      },
    ],
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
    components: {
      schemas: {
        Todo: {
          type: "object",
          required: ["id", "title", "completed", "createdAt", "updatedAt"],
          properties: {
            id: {
              type: "string",
              description: "Unique identifier for the todo",
              example: "todo-123",
            },
            title: {
              type: "string",
              maxLength: 200,
              description: "Title of the todo",
              example: "Complete project documentation",
            },
            description: {
              type: "string",
              nullable: true,
              maxLength: 1000,
              description: "Optional description of the todo",
              example: "Write comprehensive documentation for the todo API project",
            },
            completed: {
              type: "boolean",
              description: "Whether the todo is completed",
              example: false,
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Creation timestamp",
              example: "2024-01-01T12:00:00.000Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Last update timestamp",
              example: "2024-01-01T12:00:00.000Z",
            },
          },
        },
        CreateTodoRequest: {
          type: "object",
          required: ["title"],
          properties: {
            title: {
              type: "string",
              maxLength: 200,
              description: "Title of the todo",
              example: "Complete project documentation",
            },
            description: {
              type: "string",
              maxLength: 1000,
              description: "Optional description of the todo",
              example: "Write comprehensive documentation for the todo API project",
            },
          },
        },
        UpdateTodoRequest: {
          type: "object",
          properties: {
            title: {
              type: "string",
              maxLength: 200,
              description: "Title of the todo",
              example: "Complete project documentation",
            },
            description: {
              type: "string",
              nullable: true,
              maxLength: 1000,
              description: "Optional description of the todo",
              example: "Write comprehensive documentation for the todo API project",
            },
            completed: {
              type: "boolean",
              description: "Whether the todo is completed",
              example: true,
            },
          },
        },
        TodosResponse: {
          type: "object",
          properties: {
            data: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Todo",
              },
            },
            pagination: {
              type: "object",
              properties: {
                page: {
                  type: "integer",
                  example: 1,
                },
                limit: {
                  type: "integer",
                  example: 10,
                },
                total: {
                  type: "integer",
                  example: 100,
                },
                totalPages: {
                  type: "integer",
                  example: 10,
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
                  description: "Human readable error message",
                  example: 'Todo with id "123" not found',
                },
                details: {
                  type: "object",
                  description: "Additional error details",
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
              example: "healthy",
            },
            timestamp: {
              type: "string",
              format: "date-time",
              example: "2024-01-01T12:00:00.000Z",
            },
            message: {
              type: "string",
              example: "Todo List API is running",
            },
          },
        },
      },
      responses: {
        NotFound: {
          description: "Resource not found",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        BadRequest: {
          description: "Bad request",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
        InternalServerError: {
          description: "Internal server error",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/ErrorResponse",
              },
            },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts"],
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);
