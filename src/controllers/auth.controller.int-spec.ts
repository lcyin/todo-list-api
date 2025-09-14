import request from "supertest";
import app from "../app";
import { pool } from "../config/database";

jest.mock("../components/users.component", () => {
  return {
    verifyPassword: () => Promise.resolve(true),
    hashPassword: (password: string) => Promise.resolve(`hashed-${password}`),
  };
});

jest.mock("../middleware/auth.middleware", () => {
  return {
    authenticateToken: (
      req: any,
      res: any,
      next: (err?: any) => void
    ): void => {
      // Mock authentication by attaching a user object to the request
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new Error("No token provided");
      }
      const userId = authHeader.substring(7);
      req.user = {
        id: userId,
      };
      next();
    },
  };
});

describe("AuthController", () => {
  const appInstance = app;

  beforeEach(() => {
    // Reset any state if necessary before each test
    // For example, clear the postgres database
    const query = `DELETE FROM users;`;
    return pool.query(query);
  });
  describe("POST /auth/register", () => {
    it("should register a new user successfully", async () => {
      const path = "/auth/register";
      const payload = {
        email: "test@example.com",
        password: "Password@123",
        firstName: "John",
        lastName: "Doe",
      };
      const { body, status } = await request(appInstance)
        .post(path)
        .send(payload);
      expect({ body, status }).toEqual({
        body: {
          data: {
            token: expect.any(String),
            user: {
              createdAt: expect.any(String),
              email: "test@example.com",
              firstName: "John",
              id: expect.any(String),
              lastName: "Doe",
              updatedAt: expect.any(String),
            },
          },
          message: "User registered successfully",
          success: true,
        },
        status: 201,
      });
    });

    describe("should handle registration errors", () => {
      describe("when email is already in use", () => {
        it("should return 400 if email is already in use", async () => {
          await setupUser("test@example.com", "Password@123", "John", "Doe");
          const path = "/auth/register";
          const payload = {
            email: "test@example.com",
            password: "Password@123",
            firstName: "John",
            lastName: "Doe",
          };
          const { body, status } = await request(appInstance)
            .post(path)
            .send(payload);
          expect({ body, status }).toEqual({
            body: {
              error: "User with this email already exists",
              success: false,
            },
            status: 400,
          });
        });
      });
      describe("invalid password", () => {
        it("should return 400 if password is too short", async () => {
          const path = "/auth/register";
          const payload = {
            email: "test@example.com",
            password: "short",
            firstName: "John",
            lastName: "Doe",
          };
          const { body, status } = await request(appInstance)
            .post(path)
            .send(payload);
          expect({ body, status }).toEqual({
            body: {
              error:
                "Validation failed: body.password: Password must be at least 8 characters long, body.password: Password must contain at least one lowercase letter, one uppercase letter, and one number",
              success: false,
            },
            status: 400,
          });
        });
      });
    });
  });

  describe("POST /auth/login", () => {
    it("should login user successfully", async () => {
      await setupUser("test@example.com", "Password@123", "John", "Doe");
      const path = "/auth/login";
      const payload = {
        email: "test@example.com",
        password: "Password@123",
      };
      const { body, status } = await request(appInstance)
        .post(path)
        .send(payload);
      expect({ body, status }).toEqual({
        body: {
          data: {
            token: expect.any(String),
            user: {
              createdAt: expect.any(String),
              email: "test@example.com",
              firstName: "John",
              id: expect.any(String),
              lastName: "Doe",
              updatedAt: expect.any(String),
            },
          },
          message: "Login successful",
          success: true,
        },
        status: 200,
      });
    });
  });

  describe("GET /auth/profile", () => {
    it("should get user profile successfully", async () => {
      // Arrange
      const existingUser = await setupUser(
        "test@example.com",
        "Password@123",
        "John",
        "Doe"
      );
      const path = "/auth/profile";
      const { body, status } = await request(appInstance)
        .get(path)
        .set("Authorization", `Bearer ${existingUser.id}`) // Mock auth token with user ID
        .send();

      expect({ body, status }).toEqual({
        body: {
          data: {
            createdAt: expect.any(String),
            email: "test@example.com",
            firstName: "John",
            id: expect.any(String),
            lastName: "Doe",
            updatedAt: expect.any(String),
          },
          message: "Profile retrieved successfully",
          success: true,
        },
        status: 200,
      });
    });
  });

  describe("PUT /auth/profile", () => {
    it("should update user profile successfully", async () => {
      const existingUser = await setupUser(
        "test@example.com",
        "Password@123",
        "John",
        "Doe"
      );

      const updatedData = {
        firstName: "Jane",
        lastName: "Smith",
        email: "jane@example.com",
      };

      const path = "/auth/profile";
      const { body, status } = await request(appInstance)
        .put(path)
        .set("Authorization", `Bearer ${existingUser.id}`) // Mock auth token with user ID
        .send(updatedData);

      expect({ body, status }).toEqual({
        body: {
          data: {
            createdAt: expect.any(String),
            email: "jane@example.com",
            firstName: "Jane",
            id: expect.any(String),
            lastName: "Smith",
            updatedAt: expect.any(String),
          },
          message: "Profile updated successfully",
          success: true,
        },
        status: 200,
      });
    });
    // });

    // it("should handle empty update object", async () => {
    //   // Arrange
    //   mockAuthenticatedRequest.body = {};

    //   // Act
    //   await authController.updateProfile(
    //     mockAuthenticatedRequest as AuthenticatedRequest,
    //     mockResponse as Response,
    //     mockNext
    //   );

    //   // Assert
    //   expect(mockNext).toHaveBeenCalledWith({
    //     type: ErrorCode.VALIDATION_ERROR,
    //     message: "At least one field must be provided for update",
    //   });
    //   expect(mockAuthService.updateProfile).not.toHaveBeenCalled();
    // });

    // it("should filter out undefined values", async () => {
    //   // Arrange
    //   mockAuthenticatedRequest.body = {
    //     firstName: "Jane",
    //     lastName: undefined,
    //     email: "jane@example.com",
    //   };
    //   const updatedUser = {
    //     ...mockUser,
    //     firstName: "Jane",
    //     email: "jane@example.com",
    //   };
    //   mockAuthService.updateProfile.mockResolvedValue(updatedUser);

    //   // Act
    //   await authController.updateProfile(
    //     mockAuthenticatedRequest as AuthenticatedRequest,
    //     mockResponse as Response,
    //     mockNext
    //   );

    //   // Assert
    //   expect(mockAuthService.updateProfile).toHaveBeenCalledWith(mockUser.id, {
    //     firstName: "Jane",
    //     email: "jane@example.com",
    //   });
    // });
  });

  //   xdescribe("changePassword", () => {
  //     it("should change password successfully", async () => {
  //       // Arrange
  //       mockAuthenticatedRequest.body = {
  //         currentPassword: "oldpassword",
  //         newPassword: "newpassword123",
  //       };
  //       mockAuthService.changePassword.mockResolvedValue(undefined);

  //       // Act
  //       await authController.changePassword(
  //         mockAuthenticatedRequest as AuthenticatedRequest,
  //         mockResponse as Response,
  //         mockNext
  //       );

  //       // Assert
  //       expect(mockAuthService.changePassword).toHaveBeenCalledWith(
  //         mockUser.id,
  //         "oldpassword",
  //         "newpassword123"
  //       );
  //       expect(mockResponse.json).toHaveBeenCalledWith({
  //         success: true,
  //         message: "Password changed successfully",
  //       });
  //     });

  //     it("should handle missing user in request", async () => {
  //       // Arrange
  //       const requestWithoutUser = { ...mockAuthenticatedRequest };
  //       delete requestWithoutUser.user;

  //       // Act
  //       await authController.changePassword(
  //         requestWithoutUser as AuthenticatedRequest,
  //         mockResponse as Response,
  //         mockNext
  //       );

  //       // Assert
  //       expect(mockNext).toHaveBeenCalledWith({
  //         type: ErrorCode.AUTHENTICATION_ERROR,
  //         message: "User not authenticated",
  //       });
  //     });
  //   });

  describe("DELETE /auth/account", () => {
    it("should delete account successfully", async () => {
      const existingUser = await setupUser(
        "delete-account-test@example.com",
        "password123",
        "Delete",
        "Me"
      );
      const path = "/auth/account";
      const { body, status } = await request(appInstance)
        .delete(path)
        .set("Authorization", `Bearer ${existingUser.id}`) // Mock auth token with user ID
        .send();
      expect({ body, status }).toEqual({
        body: {
          success: true,
          message: "Account deleted successfully",
        },
        status: 200,
      });
    });
  });
});

async function setupUser(
  email: string,
  password: string,
  firstName: string,
  lastName: string
) {
  const query = `
    INSERT INTO users (email, password, first_name, last_name)
    VALUES ($1, $2, $3, $4)
    RETURNING id, email, first_name AS "firstName", last_name AS "lastName", created_at AS "createdAt", updated_at AS "updatedAt"
  `;
  const values = [email, password, firstName, lastName];
  const result = await pool.query(query, values);
  return result.rows[0];
}
