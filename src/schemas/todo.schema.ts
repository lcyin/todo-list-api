import { z } from "zod";

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
        .max(200, "Title must be less than 200 characters")
        .optional(),
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
    id: z.string().uuid("Invalid todo ID format"),
  }),
});

// Schema for validating todo ID parameter
export const todoParamsSchema = z.object({
  id: z.string().uuid("Invalid todo ID format"),
});

// Export types inferred from schemas
export type CreateTodoInput = z.infer<typeof createTodoSchema>;
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>;
export type TodoParamsInput = z.infer<typeof todoParamsSchema>;
