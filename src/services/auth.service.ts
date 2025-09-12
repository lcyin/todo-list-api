import {
  UserRepository,
  CreateUserData,
} from "../repositories/users.repository";
import { JwtService } from "./jwt.service";
import { User, UserWithPassword } from "../schemas/auth.schema";
import { ErrorCode } from "../middleware/enums/error-code.enum";
import logger from "../config/logger";
import { hashPassword, verifyPassword } from "../components/users.component";

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResult {
  user: User;
  token: string;
}

export class AuthService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  /**
   * Register a new user
   */
  async register(userData: RegisterData): Promise<AuthResult> {
    try {
      const { email, password, firstName, lastName } = userData;
      // Hash password

      const hashedPassword = await hashPassword(password);

      // Check if user already exists
      const existingUser = await this.userRepository.findByEmail(email);
      if (existingUser) {
        throw {
          type: ErrorCode.USER_ALREADY_EXISTS,
          message: "User with this email already exists",
        };
      }

      // Create user
      const user = await this.userRepository.createUser({
        email,
        password: hashedPassword,
        firstName,
        lastName,
      });

      // Generate JWT token
      const token = JwtService.generateAccessToken(user.id, user.email);

      logger.info(`User registered successfully: ${email} (${user.id})`);

      return {
        user,
        token,
      };
    } catch (error: any) {
      if (error.type) {
        throw error; // Re-throw custom errors
      }

      logger.error("Registration error:", error);
      throw {
        type: ErrorCode.INTERNAL_SERVER_ERROR,
        message: "Registration failed",
      };
    }
  }

  /**
   * Login user with email and password
   */
  async login(loginData: LoginData): Promise<AuthResult> {
    try {
      const { email, password } = loginData;

      // Find user by email (with password)
      const userWithPassword = await this.userRepository.findByEmail(email);
      if (!userWithPassword) {
        throw {
          type: ErrorCode.INVALID_CREDENTIALS,
          message: "Invalid email or password",
        };
      }

      // Verify password
      const isPasswordValid = await verifyPassword(
        password,
        userWithPassword.password
      );

      if (!isPasswordValid) {
        logger.warn(`Failed login attempt for email: ${email}`);
        throw {
          type: ErrorCode.INVALID_CREDENTIALS,
          message: "Invalid email or password",
        };
      }

      // Remove password from user object
      const { password: _, ...user } = userWithPassword;

      // Generate JWT token
      const token = JwtService.generateAccessToken(user.id, user.email);

      logger.info(`User logged in successfully: ${email} (${user.id})`);

      return {
        user,
        token,
      };
    } catch (error: any) {
      if (error.type) {
        throw error; // Re-throw custom errors
      }

      logger.error("Login error:", error);
      throw {
        type: ErrorCode.INTERNAL_SERVER_ERROR,
        message: "Login failed",
      };
    }
  }

  /**
   * Get user profile by ID
   */
  async getProfile(userId: string): Promise<User> {
    try {
      const user = await this.userRepository.findById(userId);

      if (!user) {
        throw {
          type: ErrorCode.USER_NOT_FOUND,
          message: "User not found",
        };
      }

      return user;
    } catch (error: any) {
      if (error.type) {
        throw error; // Re-throw custom errors
      }

      logger.error("Get profile error:", error);
      throw {
        type: ErrorCode.INTERNAL_SERVER_ERROR,
        message: "Failed to get user profile",
      };
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(
    userId: string,
    updates: Partial<{ firstName: string; lastName: string; email: string }>
  ): Promise<User> {
    try {
      // Verify user exists
      const existingUser = await this.userRepository.findById(userId);
      if (!existingUser) {
        throw {
          type: ErrorCode.USER_NOT_FOUND,
          message: "User not found",
        };
      }

      // If email is being updated, check if it already exists
      if (updates.email && updates.email !== existingUser.email) {
        const emailExists = await this.userRepository.emailExists(
          updates.email
        );
        if (emailExists) {
          throw {
            type: ErrorCode.USER_ALREADY_EXISTS,
            message: "Email already exists",
          };
        }
      }
      const updateUserValues = {
        firstName: updates.firstName || existingUser.firstName,
        lastName: updates.lastName || existingUser.lastName,
        email: updates.email || existingUser.email,
      };
      // Update user
      const updatedUser = await this.userRepository.updateUser(
        userId,
        updateUserValues
      );

      if (!updatedUser) {
        throw {
          type: ErrorCode.USER_NOT_FOUND,
          message: "User not found",
        };
      }

      logger.info(`User profile updated: ${updatedUser.email} (${userId})`);

      return updatedUser;
    } catch (error: any) {
      if (error.type) {
        throw error; // Re-throw custom errors
      }

      logger.error("Update profile error:", error);
      throw {
        type: ErrorCode.INTERNAL_SERVER_ERROR,
        message: "Failed to update user profile",
      };
    }
  }

  /**
   * Change user password
   */
  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    try {
      // Get user with password
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw {
          type: ErrorCode.USER_NOT_FOUND,
          message: "User not found",
        };
      }

      // Get user with password for verification
      const userWithPassword = await this.userRepository.findByEmail(
        user.email
      );
      if (!userWithPassword) {
        throw {
          type: ErrorCode.USER_NOT_FOUND,
          message: "User not found",
        };
      }

      // Verify current password
      const isCurrentPasswordValid = await verifyPassword(
        currentPassword,
        userWithPassword.password
      );

      if (!isCurrentPasswordValid) {
        throw {
          type: ErrorCode.INVALID_CREDENTIALS,
          message: "Current password is incorrect",
        };
      }
      const newHashedPassword = await hashPassword(newPassword);
      // Update password
      await this.userRepository.changePassword(userId, newHashedPassword);

      logger.info(`Password changed for user: ${user.email} (${userId})`);
    } catch (error: any) {
      if (error.type) {
        throw error; // Re-throw custom errors
      }

      logger.error("Change password error:", error);
      throw {
        type: ErrorCode.INTERNAL_SERVER_ERROR,
        message: "Failed to change password",
      };
    }
  }

  /**
   * Delete user account
   */
  async deleteAccount(userId: string) {
    try {
      const existingUser = await this.userRepository.findById(userId);
      if (!existingUser) {
        throw {
          type: ErrorCode.USER_NOT_FOUND,
          message: "User not found",
        };
      }
      const deleted = await this.userRepository.softDeleteUser(userId);

      if (!deleted) {
        throw {
          type: ErrorCode.USER_NOT_FOUND,
          message: "User not found",
        };
      }

      logger.info(`User account deleted: ${userId}`);
      return deleted;
    } catch (error: any) {
      if (error.type) {
        throw error; // Re-throw custom errors
      }

      logger.error("Delete account error:", error);
      throw {
        type: ErrorCode.INTERNAL_SERVER_ERROR,
        message: "Failed to delete account",
      };
    }
  }

  /**
   * Verify JWT token and get user
   */
  async verifyTokenAndGetUser(token: string): Promise<User> {
    try {
      const decoded = JwtService.verifyToken(token);
      const user = await this.userRepository.findById(decoded.userId);

      if (!user) {
        throw {
          type: ErrorCode.USER_NOT_FOUND,
          message: "User not found",
        };
      }

      return user;
    } catch (error: any) {
      if (error.message?.includes("expired")) {
        throw {
          type: ErrorCode.AUTHENTICATION_ERROR,
          message: "Token expired",
        };
      }

      if (error.message?.includes("invalid")) {
        throw {
          type: ErrorCode.AUTHENTICATION_ERROR,
          message: "Invalid token",
        };
      }

      if (error.type) {
        throw error; // Re-throw custom errors
      }

      logger.error("Token verification error:", error);
      throw {
        type: ErrorCode.AUTHENTICATION_ERROR,
        message: "Token verification failed",
      };
    }
  }
}
