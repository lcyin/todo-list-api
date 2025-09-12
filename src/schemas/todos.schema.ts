import { z } from "zod";
// Base Todo schema
export const TodoSchema = z.object({
  id: z.uuid(),
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  completed: z.boolean(),
  userId: z.uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
// Schema for creating a new todo
export const createTodoSchema = z.object({
  body: z.object({
    title: z
      .string()
      .trim()
      .min(1, "Title is required")
      .max(200, "Title must be less than 200 characters"),
    description: z
      .string()
      .max(1000, "Description must be less than 1000 characters")
      .optional()
      .transform((val) => (val === "" ? undefined : val)),
  }),
});

// Schema for updating a todo
export const updateTodoSchema = z.object({
  body: z
    .object({
      title: z
        .string()
        .trim()
        .min(1, "Title cannot be empty")
        .max(200, "Title must be less than 200 characters"),
      description: z
        .string()
        .max(1000, "Description must be less than 1000 characters")
        .optional()
        .transform((val) => (val === "" ? undefined : val)),
      completed: z.boolean().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field must be provided for update",
    }),
  params: z.object({
    id: z.uuid("Invalid todo ID format"),
  }),
});

// Schema for validating todo ID parameter
export const todoParamsSchema = z.object({
  id: z.uuid("Invalid todo ID format"),
});

// Response schemas
export const TodoResponseSchema = z.object({
  success: z.boolean(),
  data: TodoSchema,
  message: z.string(),
});

export const TodosResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(TodoSchema),
  message: z.string(),
});

export const ErrorResponseSchema = z.object({
  success: z.boolean().default(false),
  error: z.string(),
  stack: z.string().optional(),
});

// Type inference
export type Todo = z.infer<typeof TodoSchema>;
export type CreateTodoRequest = z.infer<typeof createTodoSchema>;
export type UpdateTodoRequest = z.infer<typeof updateTodoSchema>;
export type TodoResponse = z.infer<typeof TodoResponseSchema>;
export type TodosResponse = z.infer<typeof TodosResponseSchema>;
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
