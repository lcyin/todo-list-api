import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import {
  registerSchema,
  loginSchema,
  AuthResponseSchema,
  UserResponseSchema,
  ErrorResponseSchema,
  UserSchema,
} from "../schemas/auth.schema";
import {
  createTodoSchema,
  updateTodoSchema,
  todoParamsSchema,
  TodoResponseSchema,
  TodosResponseSchema,
  TodoSchema,
} from "../schemas/todos.schema";

export function registerAuthRoutes(registry: OpenAPIRegistry) {
  // Register schemas first
  registry.register("User", UserSchema);
  registry.register("AuthResponse", AuthResponseSchema);
  registry.register("UserResponse", UserResponseSchema);
  registry.register("ErrorResponse", ErrorResponseSchema);
  registry.register("RegisterRequest", registerSchema.shape.body);
  registry.register("LoginRequest", loginSchema.shape.body);

  // Register User
  registry.registerPath({
    method: "post",
    path: "/auth/register",
    description: "Register a new user",
    summary: "User Registration",
    tags: ["Authentication"],
    request: {
      body: {
        content: {
          "application/json": {
            schema: registerSchema.shape.body,
          },
        },
      },
    },
    responses: {
      201: {
        description: "User registered successfully",
        content: {
          "application/json": {
            schema: AuthResponseSchema,
          },
        },
      },
      400: {
        description: "Bad request - validation error",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
          },
        },
      },
      409: {
        description: "Conflict - email already exists",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
          },
        },
      },
    },
  });

  // Login User
  registry.registerPath({
    method: "post",
    path: "/auth/login",
    description: "Authenticate user and return JWT token",
    summary: "User Login",
    tags: ["Authentication"],
    request: {
      body: {
        content: {
          "application/json": {
            schema: loginSchema.shape.body,
          },
        },
      },
    },
    responses: {
      200: {
        description: "User authenticated successfully",
        content: {
          "application/json": {
            schema: AuthResponseSchema,
          },
        },
      },
      400: {
        description: "Bad request - validation error",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
          },
        },
      },
      401: {
        description: "Unauthorized - invalid credentials",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
          },
        },
      },
    },
  });

  // Get User Profile
  registry.registerPath({
    method: "get",
    path: "/auth/profile",
    description: "Get current user profile information",
    summary: "Get User Profile",
    tags: ["Authentication"],
    security: [{ bearerAuth: [] }],
    responses: {
      200: {
        description: "User profile retrieved successfully",
        content: {
          "application/json": {
            schema: UserResponseSchema,
          },
        },
      },
      401: {
        description: "Unauthorized - invalid or missing token",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
          },
        },
      },
    },
  });

  // Update User Profile
  const updateProfileSchema = z
    .object({
      firstName: z.string().trim().min(1).max(100).optional(),
      lastName: z.string().trim().min(1).max(100).optional(),
      email: z.string().email().toLowerCase().trim().optional(),
    })
    .openapi({
      title: "UpdateProfileRequest",
      description: "User profile update data",
    });

  registry.register("UpdateProfileRequest", updateProfileSchema);

  registry.registerPath({
    method: "put",
    path: "/auth/profile",
    description: "Update current user profile information",
    summary: "Update User Profile",
    tags: ["Authentication"],
    security: [{ bearerAuth: [] }],
    request: {
      body: {
        content: {
          "application/json": {
            schema: updateProfileSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: "User profile updated successfully",
        content: {
          "application/json": {
            schema: UserResponseSchema,
          },
        },
      },
      400: {
        description: "Bad request - validation error",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
          },
        },
      },
      401: {
        description: "Unauthorized - invalid or missing token",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
          },
        },
      },
    },
  });

  // Change Password
  const changePasswordSchema = z
    .object({
      currentPassword: z.string().min(1),
      newPassword: z
        .string()
        .min(8)
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
    })
    .openapi({
      title: "ChangePasswordRequest",
      description: "Password change data",
    });

  registry.register("ChangePasswordRequest", changePasswordSchema);

  registry.registerPath({
    method: "put",
    path: "/auth/change-password",
    description: "Change user password",
    summary: "Change Password",
    tags: ["Authentication"],
    security: [{ bearerAuth: [] }],
    request: {
      body: {
        content: {
          "application/json": {
            schema: changePasswordSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: "Password changed successfully",
        content: {
          "application/json": {
            schema: z.object({
              success: z.boolean(),
              message: z.string(),
            }),
          },
        },
      },
      400: {
        description: "Bad request - validation error",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
          },
        },
      },
      401: {
        description: "Unauthorized - invalid credentials",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
          },
        },
      },
    },
  });

  // Delete User Account
  registry.registerPath({
    method: "delete",
    path: "/auth/account",
    description: "Soft delete user account",
    summary: "Delete User Account",
    tags: ["Authentication"],
    security: [{ bearerAuth: [] }],
    responses: {
      200: {
        description: "User account deleted successfully",
        content: {
          "application/json": {
            schema: z.object({
              success: z.boolean(),
              message: z.string(),
            }),
          },
        },
      },
      401: {
        description: "Unauthorized - invalid or missing token",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
          },
        },
      },
    },
  });
}

export function registerTodoRoutes(registry: OpenAPIRegistry) {
  // Register schemas first
  registry.register("Todo", TodoSchema);
  registry.register("TodoResponse", TodoResponseSchema);
  registry.register("TodosResponse", TodosResponseSchema);
  registry.register("CreateTodoRequest", createTodoSchema.shape.body);
  registry.register("UpdateTodoRequest", updateTodoSchema.shape.body);

  // Get All Todos
  registry.registerPath({
    method: "get",
    path: "/todos",
    description: "Retrieve all todos for the authenticated user",
    summary: "Get All Todos",
    tags: ["Todos"],
    security: [{ bearerAuth: [] }],
    responses: {
      200: {
        description: "Todos retrieved successfully",
        content: {
          "application/json": {
            schema: TodosResponseSchema,
          },
        },
      },
      401: {
        description: "Unauthorized - invalid or missing token",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
          },
        },
      },
    },
  });

  // Create Todo
  registry.registerPath({
    method: "post",
    path: "/todos",
    description: "Create a new todo for the authenticated user",
    summary: "Create Todo",
    tags: ["Todos"],
    security: [{ bearerAuth: [] }],
    request: {
      body: {
        content: {
          "application/json": {
            schema: createTodoSchema.shape.body,
          },
        },
      },
    },
    responses: {
      201: {
        description: "Todo created successfully",
        content: {
          "application/json": {
            schema: TodoResponseSchema,
          },
        },
      },
      400: {
        description: "Bad request - validation error",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
          },
        },
      },
      401: {
        description: "Unauthorized - invalid or missing token",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
          },
        },
      },
    },
  });

  // Get Todo by ID
  registry.registerPath({
    method: "get",
    path: "/todos/{id}",
    description: "Retrieve a specific todo by ID",
    summary: "Get Todo by ID",
    tags: ["Todos"],
    security: [{ bearerAuth: [] }],
    request: {
      params: todoParamsSchema,
    },
    responses: {
      200: {
        description: "Todo retrieved successfully",
        content: {
          "application/json": {
            schema: TodoResponseSchema,
          },
        },
      },
      401: {
        description: "Unauthorized - invalid or missing token",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
          },
        },
      },
      404: {
        description: "Todo not found",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
          },
        },
      },
    },
  });

  // Update Todo
  registry.registerPath({
    method: "put",
    path: "/todos/{id}",
    description: "Update a specific todo by ID",
    summary: "Update Todo",
    tags: ["Todos"],
    security: [{ bearerAuth: [] }],
    request: {
      params: updateTodoSchema.shape.params,
      body: {
        content: {
          "application/json": {
            schema: updateTodoSchema.shape.body,
          },
        },
      },
    },
    responses: {
      200: {
        description: "Todo updated successfully",
        content: {
          "application/json": {
            schema: TodoResponseSchema,
          },
        },
      },
      400: {
        description: "Bad request - validation error",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
          },
        },
      },
      401: {
        description: "Unauthorized - invalid or missing token",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
          },
        },
      },
      404: {
        description: "Todo not found",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
          },
        },
      },
    },
  });

  // Delete Todo
  registry.registerPath({
    method: "delete",
    path: "/todos/{id}",
    description: "Delete a specific todo by ID",
    summary: "Delete Todo",
    tags: ["Todos"],
    security: [{ bearerAuth: [] }],
    request: {
      params: todoParamsSchema,
    },
    responses: {
      200: {
        description: "Todo deleted successfully",
        content: {
          "application/json": {
            schema: z.object({
              success: z.boolean(),
              message: z.string(),
            }),
          },
        },
      },
      401: {
        description: "Unauthorized - invalid or missing token",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
          },
        },
      },
      404: {
        description: "Todo not found",
        content: {
          "application/json": {
            schema: ErrorResponseSchema,
          },
        },
      },
    },
  });
}
