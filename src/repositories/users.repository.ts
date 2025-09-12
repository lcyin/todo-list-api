import { Pool } from "pg";
import { UserWithPassword, User } from "../schemas/auth.schema";

import logger from "../config/logger";
import { ErrorCode } from "../middleware/enums/error-code.enum";

export interface CreateUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export class UserRepository {
  private db: Pool;

  constructor(pool: Pool) {
    this.db = pool;
  }

  /**
   * Create a new user with hashed password
   */
  async createUser(userData: CreateUserData): Promise<User> {
    const { email, password, firstName, lastName } = userData;

    try {
      const query = `
        INSERT INTO users (email, password, first_name, last_name)
        VALUES ($1, $2, $3, $4)
        RETURNING id, email, first_name as "firstName", last_name as "lastName", created_at as "createdAt", updated_at as "updatedAt"
      `;

      const result = await this.db.query(query, [
        email,
        password,
        firstName,
        lastName,
      ]);

      if (result.rows.length === 0) {
        logger.error("Failed to create user - no rows returned");
        throw {
          type: ErrorCode.DATABASE_ERROR,
          message: "Failed to create user",
        };
      }

      const user = result.rows[0];
      logger.info(`User created successfully: ${email} (${user.id})`);

      return user as User;
    } catch (error: any) {
      // Handle unique constraint violation (duplicate email)
      if (error.code === "23505" && error.constraint === "users_email_key") {
        logger.warn(`Attempt to create user with existing email: ${email}`);
        throw {
          type: ErrorCode.USER_ALREADY_EXISTS,
          message: "Email already exists",
        };
      }

      // Handle other database errors
      if (error.type) {
        throw error; // Re-throw custom errors
      }

      logger.error("Database error creating user:", error);
      throw {
        type: ErrorCode.DATABASE_ERROR,
        message: "Failed to create user",
      };
    }
  }

  /**
   * Find user by email (including password for authentication)
   */
  async findByEmail(email: string): Promise<UserWithPassword | null> {
    try {
      const query = `
        SELECT 
          id, 
          email, 
          password,
          first_name as "firstName", 
          last_name as "lastName", 
          created_at as "createdAt", 
          updated_at as "updatedAt"
        FROM users 
        WHERE email = $1
      `;

      const result = await this.db.query(query, [email]);

      if (result.rows.length === 0) {
        return null;
      }

      return result.rows[0] as UserWithPassword;
    } catch (error) {
      logger.error("Database error finding user by email:", error);
      throw {
        type: ErrorCode.DATABASE_ERROR,
        message: "Failed to find user",
      };
    }
  }

  /**
   * Find user by ID (without password)
   */
  async findById(id: string): Promise<User | null> {
    try {
      const query = `
        SELECT 
          id, 
          email, 
          first_name as "firstName", 
          last_name as "lastName", 
          created_at as "createdAt", 
          updated_at as "updatedAt"
        FROM users 
        WHERE id = $1
      `;

      const result = await this.db.query(query, [id]);

      if (result.rows.length === 0) {
        return null;
      }

      return result.rows[0] as User;
    } catch (error) {
      logger.error("Database error finding user by ID:", error);
      throw {
        type: ErrorCode.DATABASE_ERROR,
        message: "Failed to find user",
      };
    }
  }

  /**
   * Update user information
   */
  async updateUser(
    id: string,
    updates: Pick<CreateUserData, "email" | "firstName" | "lastName">
  ): Promise<User | null> {
    try {
      const { email, firstName, lastName } = updates;

      const updateValues = [firstName, lastName, email];

      const query = `
        UPDATE users 
        SET first_name = $1, last_name = $2, email = $3, updated_at = CURRENT_TIMESTAMP
        WHERE id = $4
        RETURNING id, email, first_name as "firstName", last_name as "lastName", created_at as "createdAt", updated_at as "updatedAt"
      `;

      const result = await this.db.query(query, [...updateValues, id]);

      if (result.rows.length === 0) {
        return null;
      }

      const user = result.rows[0];
      logger.info(`User updated successfully: ${user.email} (${id})`);

      return user as User;
    } catch (error: any) {
      // Handle unique constraint violation (duplicate email)
      if (error.code === "23505" && error.constraint === "users_email_key") {
        throw {
          type: ErrorCode.USER_ALREADY_EXISTS,
          message: "Email already exists",
        };
      }

      // Handle other database errors
      if (error.type) {
        throw error; // Re-throw custom errors
      }

      logger.error("Database error updating user:", error);
      throw {
        type: ErrorCode.DATABASE_ERROR,
        message: "Failed to update user",
      };
    }
  }

  async changePassword(id: string, newHashedPassword: string): Promise<void> {
    try {
      const query = `
        UPDATE users 
        SET password = $1, updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
      `;

      await this.db.query(query, [newHashedPassword, id]);

      logger.info(`User password changed successfully: ${id}`);
    } catch (error) {
      logger.error("Database error changing user password:", error);
      throw {
        type: ErrorCode.DATABASE_ERROR,
        message: "Failed to change user password",
      };
    }
  }

  /**
   * Delete user by ID
   */
  async deleteUser(
    id: string
  ): Promise<{ id: string; deletedAt: string } | null> {
    try {
      const softDeleteQuery = `
        UPDATE users 
        SET deleted_at = CURRENT_TIMESTAMP 
        WHERE id = $1
        RETURNING id, deleted_at;
      `;

      const result = await this.db.query(softDeleteQuery, [id]);

      const deleted = result.rows[0];
      if (deleted) {
        logger.info(`User soft deleted successfully: ${id}`);
      }

      return deleted;
    } catch (error) {
      logger.error("Database error deleting user:", error);
      throw {
        type: ErrorCode.DATABASE_ERROR,
        message: "Failed to soft delete user",
      };
    }
  }

  /**
   * Check if email exists
   */
  async emailExists(email: string): Promise<boolean> {
    try {
      const query = "SELECT 1 FROM users WHERE email = $1 LIMIT 1";
      const result = await this.db.query(query, [email]);
      return result.rows.length > 0;
    } catch (error) {
      logger.error("Database error checking email existence:", error);
      throw {
        type: ErrorCode.DATABASE_ERROR,
        message: "Failed to check email existence",
      };
    }
  }
}
