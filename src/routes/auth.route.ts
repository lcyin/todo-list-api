import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../services/auth.service';
import { UserRepository } from '../repositories/users.repository';
import { validate } from '../middleware/validation';
import { authenticateToken } from '../middleware/auth.middleware';
import { registerSchema, loginSchema } from '../schemas/auth.schema';
import { z } from 'zod';
import { pool } from '../config/database';

// Validation schemas for auth-specific endpoints
const updateProfileSchema = z.object({
  body: z.object({
    firstName: z
      .string()
      .trim()
      .min(1, 'First name cannot be empty')
      .max(100, 'First name must be less than 100 characters')
      .optional(),
    lastName: z
      .string()
      .trim()
      .min(1, 'Last name cannot be empty')
      .max(100, 'Last name must be less than 100 characters')
      .optional(),
    email: z
      .string()
      .email('Please provide a valid email address')
      .toLowerCase()
      .trim()
      .optional(),
  }).refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  }),
});

const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'New password must be at least 8 characters long')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'New password must contain at least one lowercase letter, one uppercase letter, and one number'
      ),
  }),
});

const verifyTokenSchema = z.object({
  body: z.object({
    token: z.string().min(1, 'Token is required'),
  }),
});

// Create router
const router = Router();

// Initialize dependencies
const userRepository = new UserRepository(pool);
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);

// Public routes (no authentication required)

/**
 * POST /api/auth/register
 * Register a new user account
 */
router.post(
  '/register',
  validate(registerSchema),
  authController.register
);

/**
 * POST /api/auth/login
 * Login with email and password
 */
router.post(
  '/login',
  validate(loginSchema),
  authController.login
);

/**
 * POST /api/auth/verify-token
 * Verify if a JWT token is valid
 */
router.post(
  '/verify-token',
  validate(verifyTokenSchema),
  authController.verifyToken
);

// Protected routes (authentication required)

/**
 * GET /api/auth/profile
 * Get current user profile
 */
router.get(
  '/profile',
  authenticateToken,
  authController.getProfile
);

/**
 * PUT /api/auth/profile
 * Update current user profile
 */
router.put(
  '/profile',
  authenticateToken,
  validate(updateProfileSchema),
  authController.updateProfile
);

/**
 * POST /api/auth/change-password
 * Change user password
 */
router.post(
  '/change-password',
  authenticateToken,
  validate(changePasswordSchema),
  authController.changePassword
);

/**
 * DELETE /api/auth/account
 * Delete user account
 */
router.delete(
  '/account',
  authenticateToken,
  authController.deleteAccount
);

/**
 * POST /api/auth/logout
 * Logout user (client-side token removal)
 */
router.post(
  '/logout',
  authenticateToken,
  authController.logout
);

export { router as authRoutes };
