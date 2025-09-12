import request from "supertest";
import app from "../app";
import { pool } from "../config/database";
// Mock the logger
// jest.mock("../../config/logger", () => ({
//   info: jest.fn(),
//   error: jest.fn(),
//   warn: jest.fn(),
//   debug: jest.fn(),
// }));

describe("AuthController", () => {
  //   let authController: AuthController;
  //   let mockAuthService: jest.Mocked<AuthService>;
  //   let mockRequest: Partial<Request>;
  //   let mockAuthenticatedRequest: Partial<AuthenticatedRequest>;
  //   let mockResponse: Partial<Response>;
  //   let mockNext: jest.MockedFunction<NextFunction>;
  const appInstance = app;
  // Mock user data
  const mockUser = {
    id: "123e4567-e89b-12d3-a456-426614174000",
    email: "test@example.com",
    firstName: "John",
    lastName: "Doe",
    createdAt: new Date("2023-01-01"),
    updatedAt: new Date("2023-01-01"),
  };
  beforeEach(() => {
    // Reset any state if necessary before each test
    // For example, clear the postgres database
    const query = `DELETE FROM users;`;
    return pool.query(query);
  });
  describe("register", () => {
    it("should register a new user successfully", async () => {
      const path = "/api/auth/register";
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
          const existingUser = await setupUser(
            "test@example.com",
            "Password@123",
            "John",
            "Doe"
          );
          const path = "/api/auth/register";
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
          const path = "/api/auth/register";
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

  //   xdescribe("login", () => {
  //     it("should login user successfully", async () => {
  //       // Arrange
  //       mockRequest.body = {
  //         email: "test@example.com",
  //         password: "password123",
  //       };
  //       mockAuthService.login.mockResolvedValue(mockAuthResult);

  //       // Act
  //       await authController.login(
  //         mockRequest as Request,
  //         mockResponse as Response,
  //         mockNext
  //       );

  //       // Assert
  //       expect(mockAuthService.login).toHaveBeenCalledWith({
  //         email: "test@example.com",
  //         password: "password123",
  //       });
  //       expect(mockResponse.json).toHaveBeenCalledWith({
  //         success: true,
  //         data: {
  //           user: mockUser,
  //           token: "mock-jwt-token",
  //         },
  //         message: "Login successful",
  //       });
  //       expect(mockNext).not.toHaveBeenCalled();
  //     });

  //     it("should handle login errors", async () => {
  //       // Arrange
  //       mockRequest.body = {
  //         email: "test@example.com",
  //         password: "wrongpassword",
  //       };
  //       const error = new Error("Invalid credentials");
  //       mockAuthService.login.mockRejectedValue(error);

  //       // Act
  //       await authController.login(
  //         mockRequest as Request,
  //         mockResponse as Response,
  //         mockNext
  //       );

  //       // Assert
  //       expect(mockNext).toHaveBeenCalledWith(error);
  //     });
  //   });

  //   xdescribe("getProfile", () => {
  //     it("should get user profile successfully", async () => {
  //       // Arrange
  //       mockAuthService.getProfile.mockResolvedValue(mockUser);

  //       // Act
  //       await authController.getProfile(
  //         mockAuthenticatedRequest as AuthenticatedRequest,
  //         mockResponse as Response,
  //         mockNext
  //       );

  //       // Assert
  //       expect(mockAuthService.getProfile).toHaveBeenCalledWith(mockUser.id);
  //       expect(mockResponse.json).toHaveBeenCalledWith({
  //         success: true,
  //         data: mockUser,
  //         message: "Profile retrieved successfully",
  //       });
  //       expect(mockNext).not.toHaveBeenCalled();
  //     });

  //     it("should handle missing user in request", async () => {
  //       // Arrange
  //       const requestWithoutUser = { ...mockAuthenticatedRequest };
  //       delete requestWithoutUser.user;

  //       // Act
  //       await authController.getProfile(
  //         requestWithoutUser as AuthenticatedRequest,
  //         mockResponse as Response,
  //         mockNext
  //       );

  //       // Assert
  //       expect(mockNext).toHaveBeenCalledWith({
  //         type: ErrorCode.AUTHENTICATION_ERROR,
  //         message: "User not authenticated",
  //       });
  //       expect(mockAuthService.getProfile).not.toHaveBeenCalled();
  //     });

  //     it("should handle service errors", async () => {
  //       // Arrange
  //       const error = new Error("User not found");
  //       mockAuthService.getProfile.mockRejectedValue(error);

  //       // Act
  //       await authController.getProfile(
  //         mockAuthenticatedRequest as AuthenticatedRequest,
  //         mockResponse as Response,
  //         mockNext
  //       );

  //       // Assert
  //       expect(mockNext).toHaveBeenCalledWith(error);
  //     });
  //   });

  //   xdescribe("updateProfile", () => {
  //     it("should update user profile successfully", async () => {
  //       // Arrange
  //       mockAuthenticatedRequest.body = {
  //         firstName: "Jane",
  //         lastName: "Smith",
  //         email: "jane@example.com",
  //       };
  //       const updatedUser = {
  //         ...mockUser,
  //         firstName: "Jane",
  //         lastName: "Smith",
  //         email: "jane@example.com",
  //       };
  //       mockAuthService.updateProfile.mockResolvedValue(updatedUser);

  //       // Act
  //       await authController.updateProfile(
  //         mockAuthenticatedRequest as AuthenticatedRequest,
  //         mockResponse as Response,
  //         mockNext
  //       );

  //       // Assert
  //       expect(mockAuthService.updateProfile).toHaveBeenCalledWith(mockUser.id, {
  //         firstName: "Jane",
  //         lastName: "Smith",
  //         email: "jane@example.com",
  //       });
  //       expect(mockResponse.json).toHaveBeenCalledWith({
  //         success: true,
  //         data: updatedUser,
  //         message: "Profile updated successfully",
  //       });
  //     });

  //     it("should handle empty update object", async () => {
  //       // Arrange
  //       mockAuthenticatedRequest.body = {};

  //       // Act
  //       await authController.updateProfile(
  //         mockAuthenticatedRequest as AuthenticatedRequest,
  //         mockResponse as Response,
  //         mockNext
  //       );

  //       // Assert
  //       expect(mockNext).toHaveBeenCalledWith({
  //         type: ErrorCode.VALIDATION_ERROR,
  //         message: "At least one field must be provided for update",
  //       });
  //       expect(mockAuthService.updateProfile).not.toHaveBeenCalled();
  //     });

  //     it("should filter out undefined values", async () => {
  //       // Arrange
  //       mockAuthenticatedRequest.body = {
  //         firstName: "Jane",
  //         lastName: undefined,
  //         email: "jane@example.com",
  //       };
  //       const updatedUser = {
  //         ...mockUser,
  //         firstName: "Jane",
  //         email: "jane@example.com",
  //       };
  //       mockAuthService.updateProfile.mockResolvedValue(updatedUser);

  //       // Act
  //       await authController.updateProfile(
  //         mockAuthenticatedRequest as AuthenticatedRequest,
  //         mockResponse as Response,
  //         mockNext
  //       );

  //       // Assert
  //       expect(mockAuthService.updateProfile).toHaveBeenCalledWith(mockUser.id, {
  //         firstName: "Jane",
  //         email: "jane@example.com",
  //       });
  //     });
  //   });

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

  //   xdescribe("deleteAccount", () => {
  //     it("should delete account successfully", async () => {
  //       // Arrange
  //       mockAuthService.deleteAccount.mockResolvedValue(undefined);

  //       // Act
  //       await authController.deleteAccount(
  //         mockAuthenticatedRequest as AuthenticatedRequest,
  //         mockResponse as Response,
  //         mockNext
  //       );

  //       // Assert
  //       expect(mockAuthService.deleteAccount).toHaveBeenCalledWith(mockUser.id);
  //       expect(mockResponse.json).toHaveBeenCalledWith({
  //         success: true,
  //         message: "Account deleted successfully",
  //       });
  //     });

  //     it("should handle service errors", async () => {
  //       // Arrange
  //       const error = new Error("Failed to delete account");
  //       mockAuthService.deleteAccount.mockRejectedValue(error);

  //       // Act
  //       await authController.deleteAccount(
  //         mockAuthenticatedRequest as AuthenticatedRequest,
  //         mockResponse as Response,
  //         mockNext
  //       );

  //       // Assert
  //       expect(mockNext).toHaveBeenCalledWith(error);
  //     });
  //   });

  //   xdescribe("verifyToken", () => {
  //     it("should verify token successfully", async () => {
  //       // Arrange
  //       mockRequest.body = { token: "valid-jwt-token" };
  //       mockAuthService.verifyTokenAndGetUser.mockResolvedValue(mockUser);

  //       // Act
  //       await authController.verifyToken(
  //         mockRequest as Request,
  //         mockResponse as Response,
  //         mockNext
  //       );

  //       // Assert
  //       expect(mockAuthService.verifyTokenAndGetUser).toHaveBeenCalledWith(
  //         "valid-jwt-token"
  //       );
  //       expect(mockResponse.json).toHaveBeenCalledWith({
  //         success: true,
  //         data: mockUser,
  //         message: "Token is valid",
  //       });
  //     });

  //     it("should handle missing token", async () => {
  //       // Arrange
  //       mockRequest.body = {};

  //       // Act
  //       await authController.verifyToken(
  //         mockRequest as Request,
  //         mockResponse as Response,
  //         mockNext
  //       );

  //       // Assert
  //       expect(mockNext).toHaveBeenCalledWith({
  //         type: ErrorCode.VALIDATION_ERROR,
  //         message: "Token is required",
  //       });
  //       expect(mockAuthService.verifyTokenAndGetUser).not.toHaveBeenCalled();
  //     });

  //     it("should handle invalid token", async () => {
  //       // Arrange
  //       mockRequest.body = { token: "invalid-token" };
  //       const error = new Error("Invalid token");
  //       mockAuthService.verifyTokenAndGetUser.mockRejectedValue(error);

  //       // Act
  //       await authController.verifyToken(
  //         mockRequest as Request,
  //         mockResponse as Response,
  //         mockNext
  //       );

  //       // Assert
  //       expect(mockNext).toHaveBeenCalledWith(error);
  //     });
  //   });

  //   xdescribe("logout", () => {
  //     it("should logout successfully", async () => {
  //       // Act
  //       await authController.logout(
  //         mockAuthenticatedRequest as AuthenticatedRequest,
  //         mockResponse as Response,
  //         mockNext
  //       );

  //       // Assert
  //       expect(logger.info).toHaveBeenCalledWith(
  //         `User logged out: ${mockUser.email} (${mockUser.id})`
  //       );
  //       expect(mockResponse.json).toHaveBeenCalledWith({
  //         success: true,
  //         message: "Logout successful",
  //       });
  //     });

  //     it("should handle logout with missing user info", async () => {
  //       // Arrange
  //       const requestWithoutUser = { ...mockAuthenticatedRequest };
  //       delete requestWithoutUser.user;

  //       // Act
  //       await authController.logout(
  //         requestWithoutUser as AuthenticatedRequest,
  //         mockResponse as Response,
  //         mockNext
  //       );

  //       // Assert
  //       expect(logger.info).toHaveBeenCalledWith(
  //         "User logged out: unknown (unknown)"
  //       );
  //       expect(mockResponse.json).toHaveBeenCalledWith({
  //         success: true,
  //         message: "Logout successful",
  //       });
  //     });

  //     it("should handle logout errors", async () => {
  //       // Arrange
  //       const error = new Error("Logout error");
  //       (logger.info as jest.Mock).mockImplementation(() => {
  //         throw error;
  //       });

  //       // Act
  //       await authController.logout(
  //         mockAuthenticatedRequest as AuthenticatedRequest,
  //         mockResponse as Response,
  //         mockNext
  //       );

  //       // Assert
  //       expect(mockNext).toHaveBeenCalledWith(error);
  //     });
  //   });
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
