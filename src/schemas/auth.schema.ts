import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

// Extend Zod with OpenAPI functionality
extendZodWithOpenApi(z);

// Base User schema (without password for responses)
export const UserSchema = z
  .object({
    id: z
      .uuid()
      .openapi({
        description: "Unique identifier for the user",
        example: "123e4567-e89b-12d3-a456-426614174000",
      }),
    email: z
      .string()
      .email()
      .openapi({
        description: "User email address",
        example: "john.doe@example.com",
      }),
    firstName: z
      .string()
      .min(1)
      .max(100)
      .openapi({ description: "User first name", example: "John" }),
    lastName: z
      .string()
      .min(1)
      .max(100)
      .openapi({ description: "User last name", example: "Doe" }),
    createdAt: z
      .date()
      .openapi({
        description: "User creation timestamp",
        example: "2023-01-01T00:00:00Z",
      }),
    updatedAt: z
      .date()
      .openapi({
        description: "User last update timestamp",
        example: "2023-01-01T00:00:00Z",
      }),
  })
  .openapi({ title: "User", description: "User information without password" });

// Full User schema (with password for database operations)
export const UserWithPasswordSchema = UserSchema.extend({
  password: z.string(),
});

// Delete User schema (for delete operations)
export const DeletedUserSchema = z.object({
  id: z.uuid(),
  deletedAt: z.date(),
});

// Registration schema
export const registerSchema = z
  .object({
    body: z
      .object({
        email: z
          .string()
          .email("Please provide a valid email address")
          .toLowerCase()
          .trim()
          .openapi({
            description: "User email address",
            example: "john.doe@example.com",
          }),
        password: z
          .string()
          .min(8, "Password must be at least 8 characters long")
          .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            "Password must contain at least one lowercase letter, one uppercase letter, and one number"
          )
          .openapi({
            description: "User password with complexity requirements",
            example: "MySecureP@ss123",
          }),
        firstName: z
          .string()
          .trim()
          .min(1, "First name is required")
          .max(100, "First name must be less than 100 characters")
          .openapi({ description: "User first name", example: "John" }),
        lastName: z
          .string()
          .trim()
          .min(1, "Last name is required")
          .max(100, "Last name must be less than 100 characters")
          .openapi({ description: "User last name", example: "Doe" }),
      })
      .openapi({
        title: "RegisterRequest",
        description: "User registration data",
      }),
  })
  .openapi({ title: "RegisterSchema" });

// Login schema
export const loginSchema = z
  .object({
    body: z
      .object({
        email: z
          .string()
          .email("Please provide a valid email address")
          .toLowerCase()
          .trim()
          .openapi({
            description: "User email address",
            example: "john.doe@example.com",
          }),
        password: z
          .string()
          .min(1, "Password is required")
          .openapi({
            description: "User password",
            example: "MySecureP@ss123",
          }),
      })
      .openapi({
        title: "LoginRequest",
        description: "User login credentials",
      }),
  })
  .openapi({ title: "LoginSchema" });

// Auth response schemas
export const AuthResponseSchema = z
  .object({
    success: z
      .boolean()
      .openapi({
        description: "Indicates if the request was successful",
        example: true,
      }),
    data: z
      .object({
        user: UserSchema,
        token: z
          .string()
          .openapi({
            description: "JWT authentication token",
            example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
          }),
      })
      .openapi({
        title: "AuthData",
        description: "Authentication response data",
      }),
    message: z
      .string()
      .openapi({
        description: "Response message",
        example: "User authenticated successfully",
      }),
  })
  .openapi({ title: "AuthResponse", description: "Authentication response" });

export const UserResponseSchema = z
  .object({
    success: z
      .boolean()
      .openapi({
        description: "Indicates if the request was successful",
        example: true,
      }),
    data: UserSchema,
    message: z
      .string()
      .openapi({
        description: "Response message",
        example: "User retrieved successfully",
      }),
  })
  .openapi({ title: "UserResponse", description: "User data response" });

// Error response schema
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
      .openapi({
        description: "Error message",
        example: "Invalid credentials",
      }),
    stack: z
      .string()
      .optional()
      .openapi({
        description: "Error stack trace (development only)",
        example: "Error: Invalid credentials\n    at ...",
      }),
  })
  .openapi({ title: "ErrorResponse", description: "Error response format" });

// JWT payload schema
export const JwtPayloadSchema = z.object({
  userId: z.uuid(),
  email: z.string().email(),
  iat: z.number(),
  exp: z.number(),
});

// Type inference
export type User = z.infer<typeof UserSchema>;
export type UserWithPassword = z.infer<typeof UserWithPasswordSchema>;
export type RegisterRequest = z.infer<typeof registerSchema>;
export type LoginRequest = z.infer<typeof loginSchema>;
export type AuthResponse = z.infer<typeof AuthResponseSchema>;
export type UserResponse = z.infer<typeof UserResponseSchema>;
export type JwtPayload = z.infer<typeof JwtPayloadSchema>;
export type DeletedUser = z.infer<typeof DeletedUserSchema>;
