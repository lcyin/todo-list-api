import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

// Extend Zod with OpenAPI functionality
extendZodWithOpenApi(z);

// Base Todo schema
export const TodoSchema = z
  .object({
    id: z
      .uuid()
      .openapi({
        description: "Unique identifier for the todo",
        example: "123e4567-e89b-12d3-a456-426614174000",
      }),
    title: z
      .string()
      .min(1)
      .max(255)
      .openapi({
        description: "Todo title",
        example: "Complete project documentation",
      }),
    description: z
      .string()
      .optional()
      .openapi({
        description: "Todo description",
        example: "Write comprehensive API documentation with examples",
      }),
    completed: z
      .boolean()
      .openapi({ description: "Todo completion status", example: false }),
    userId: z
      .uuid()
      .openapi({
        description: "ID of the user who owns this todo",
        example: "123e4567-e89b-12d3-a456-426614174000",
      }),
    createdAt: z
      .date()
      .openapi({
        description: "Todo creation timestamp",
        example: "2023-01-01T00:00:00Z",
      }),
    updatedAt: z
      .date()
      .openapi({
        description: "Todo last update timestamp",
        example: "2023-01-01T00:00:00Z",
      }),
  })
  .openapi({ title: "Todo", description: "Todo item" });
// Schema for creating a new todo
export const createTodoSchema = z
  .object({
    body: z
      .object({
        title: z
          .string()
          .trim()
          .min(1, "Title is required")
          .max(200, "Title must be less than 200 characters")
          .openapi({
            description: "Todo title",
            example: "Complete project documentation",
          }),
        description: z
          .string()
          .max(1000, "Description must be less than 1000 characters")
          .optional()
          .transform((val) => (val === "" ? undefined : val))
          .openapi({
            description: "Todo description",
            example: "Write comprehensive API documentation with examples",
          }),
      })
      .openapi({
        title: "CreateTodoRequest",
        description: "Data for creating a new todo",
      }),
  })
  .openapi({ title: "CreateTodoSchema" });

// Schema for updating a todo
export const updateTodoSchema = z
  .object({
    body: z
      .object({
        title: z
          .string()
          .trim()
          .min(1, "Title cannot be empty")
          .max(200, "Title must be less than 200 characters")
          .openapi({
            description: "Todo title",
            example: "Complete project documentation",
          }),
        description: z
          .string()
          .max(1000, "Description must be less than 1000 characters")
          .optional()
          .transform((val) => (val === "" ? undefined : val))
          .openapi({
            description: "Todo description",
            example: "Write comprehensive API documentation with examples",
          }),
        completed: z
          .boolean()
          .optional()
          .openapi({ description: "Todo completion status", example: true }),
      })
      .refine((data) => Object.keys(data).length > 0, {
        message: "At least one field must be provided for update",
      })
      .openapi({
        title: "UpdateTodoRequest",
        description: "Data for updating a todo",
      }),
    params: z
      .object({
        id: z
          .uuid("Invalid todo ID format")
          .openapi({
            description: "Todo ID",
            example: "123e4567-e89b-12d3-a456-426614174000",
          }),
      })
      .openapi({ title: "TodoParams", description: "Todo ID parameter" }),
  })
  .openapi({ title: "UpdateTodoSchema" });

// Schema for validating todo ID parameter
export const todoParamsSchema = z
  .object({
    id: z
      .uuid("Invalid todo ID format")
      .openapi({
        description: "Todo ID",
        example: "123e4567-e89b-12d3-a456-426614174000",
      }),
  })
  .openapi({
    title: "TodoIdParams",
    description: "Todo ID parameter validation",
  });

// Response schemas
export const TodoResponseSchema = z
  .object({
    success: z
      .boolean()
      .openapi({
        description: "Indicates if the request was successful",
        example: true,
      }),
    data: TodoSchema,
    message: z
      .string()
      .openapi({
        description: "Response message",
        example: "Todo retrieved successfully",
      }),
  })
  .openapi({ title: "TodoResponse", description: "Single todo response" });

export const TodosResponseSchema = z
  .object({
    success: z
      .boolean()
      .openapi({
        description: "Indicates if the request was successful",
        example: true,
      }),
    data: z.array(TodoSchema).openapi({ description: "List of todos" }),
    message: z
      .string()
      .openapi({
        description: "Response message",
        example: "Todos retrieved successfully",
      }),
  })
  .openapi({ title: "TodosResponse", description: "Multiple todos response" });

export const ErrorResponseSchema = z
  .object({
    success: z
      .boolean()
      .default(false)
      .openapi({
        description: "Always false for error responses",
        example: false,
      }),
    error: z
      .string()
      .openapi({ description: "Error message", example: "Todo not found" }),
    stack: z
      .string()
      .optional()
      .openapi({
        description: "Error stack trace (development only)",
        example: "Error: Todo not found\n    at ...",
      }),
  })
  .openapi({ title: "ErrorResponse", description: "Error response format" });

// Type inference
export type Todo = z.infer<typeof TodoSchema>;
export type CreateTodoRequest = z.infer<typeof createTodoSchema>;
export type UpdateTodoRequest = z.infer<typeof updateTodoSchema>;
export type TodoResponse = z.infer<typeof TodoResponseSchema>;
export type TodosResponse = z.infer<typeof TodosResponseSchema>;
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
