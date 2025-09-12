import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import { ErrorCode } from "../middleware/enums/error-code.enum";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import {
  AuthResponseSchema,
  UserResponseSchema,
  UserSchema,
} from "../schemas/auth.schema";
import logger from "../config/logger";

export class AuthController {
  constructor(private authService: AuthService) {
    this.authService = authService;
  }

  /**
   * Register a new user
   * POST /api/auth/register
   */
  public register = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { email, password, firstName, lastName } = req.body;

      const authResult = await this.authService.register({
        email,
        password,
        firstName,
        lastName,
      });

      const response = AuthResponseSchema.parse({
        success: true,
        data: {
          user: UserSchema.parse(authResult.user),
          token: authResult.token,
        },
        message: "User registered successfully",
      });

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Login user
   * POST /api/auth/login
   */
  public login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { email, password } = req.body;

      const authResult = await this.authService.login({
        email,
        password,
      });

      const response = AuthResponseSchema.parse({
        success: true,
        data: {
          user: UserSchema.parse(authResult.user),
          token: authResult.token,
        },
        message: "Login successful",
      });

      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get current user profile
   * GET /api/auth/profile
   */
  public getProfile = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user?.id) {
        next({
          type: ErrorCode.AUTHENTICATION_ERROR,
          message: "User not authenticated",
        });
        return;
      }

      const user = await this.authService.getProfile(req.user.id);

      const response = UserResponseSchema.parse({
        success: true,
        data: UserSchema.parse(user),
        message: "Profile retrieved successfully",
      });

      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update user profile
   * PUT /api/auth/profile
   */
  public updateProfile = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user?.id) {
        next({
          type: ErrorCode.AUTHENTICATION_ERROR,
          message: "User not authenticated",
        });
        return;
      }

      const { firstName, lastName, email } = req.body;

      // Filter out undefined values
      const updates: any = {};
      if (firstName !== undefined) updates.firstName = firstName;
      if (lastName !== undefined) updates.lastName = lastName;
      if (email !== undefined) updates.email = email;

      if (Object.keys(updates).length === 0) {
        next({
          type: ErrorCode.VALIDATION_ERROR,
          message: "At least one field must be provided for update",
        });
        return;
      }

      const updatedUser = await this.authService.updateProfile(
        req.user.id,
        updates
      );

      const response = UserResponseSchema.parse({
        success: true,
        data: UserSchema.parse(updatedUser),
        message: "Profile updated successfully",
      });

      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Change password
   * POST /api/auth/change-password
   */
  public changePassword = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user?.id) {
        next({
          type: ErrorCode.AUTHENTICATION_ERROR,
          message: "User not authenticated",
        });
        return;
      }

      const { currentPassword, newPassword } = req.body;

      await this.authService.changePassword(
        req.user.id,
        currentPassword,
        newPassword
      );

      res.json({
        success: true,
        message: "Password changed successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Delete user account
   * DELETE /api/auth/account
   */
  public deleteAccount = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user?.id) {
        next({
          type: ErrorCode.AUTHENTICATION_ERROR,
          message: "User not authenticated",
        });
        return;
      }

      await this.authService.deleteAccount(req.user.id);

      res.json({
        success: true,
        message: "Account deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Verify token (useful for client-side token validation)
   * POST /api/auth/verify-token
   */
  public verifyToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { token } = req.body;

      if (!token) {
        next({
          type: ErrorCode.VALIDATION_ERROR,
          message: "Token is required",
        });
        return;
      }

      const user = await this.authService.verifyTokenAndGetUser(token);

      const response = UserResponseSchema.parse({
        success: true,
        data: UserSchema.parse(user),
        message: "Token is valid",
      });

      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  /**
   * @NotImplemented
   * Logout (client-side implementation)
   * POST /api/auth/logout
   * Note: Since we're using stateless JWT, logout is handled on the client side
   * by removing the token. This endpoint exists for consistency and potential
   * future token blacklisting implementation.
   */
  public logout = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // In a more advanced implementation, you might:
      // 1. Add the token to a blacklist
      // 2. Store logout timestamp
      // 3. Invalidate refresh tokens

      logger.info(
        `User logged out: ${req.user?.email || "unknown"} (${
          req.user?.id || "unknown"
        })`
      );

      res.json({
        success: true,
        message: "Logout successful",
      });
    } catch (error) {
      next(error);
    }
  };
}
