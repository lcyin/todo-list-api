import { z } from "zod";

// Base User schema (without password for responses)
export const UserSchema = z.object({
  id: z.uuid(),
  email: z.string().email(),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  createdAt: z.date(),
  updatedAt: z.date(),
});

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
export const registerSchema = z.object({
  body: z.object({
    email: z
      .string()
      .email("Please provide a valid email address")
      .toLowerCase()
      .trim(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one lowercase letter, one uppercase letter, and one number"
      ),
    firstName: z
      .string()
      .trim()
      .min(1, "First name is required")
      .max(100, "First name must be less than 100 characters"),
    lastName: z
      .string()
      .trim()
      .min(1, "Last name is required")
      .max(100, "Last name must be less than 100 characters"),
  }),
});

// Login schema
export const loginSchema = z.object({
  body: z.object({
    email: z
      .string()
      .email("Please provide a valid email address")
      .toLowerCase()
      .trim(),
    password: z.string().min(1, "Password is required"),
  }),
});

// Auth response schemas
export const AuthResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    user: UserSchema,
    token: z.string(),
  }),
  message: z.string(),
});

export const UserResponseSchema = z.object({
  success: z.boolean(),
  data: UserSchema,
  message: z.string(),
});

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
