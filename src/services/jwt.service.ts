import jwt from "jsonwebtoken";
import { JwtPayload } from "../interfaces/auth.interface";
import { config } from "../config/config";
import logger from "../config/logger";

function mapJWTConfig() {
  const secret = config.jwtSecret;
  const expiresIn = config.jwtExpiresIn || "24h";
  const refreshExpiresIn = config.jwtRefreshExpiresIn || "7d";

  if (!secret) {
    throw new Error("JWT secret is not defined in configuration");
  }
  return {
    secret,
    expiresIn: expiresIn as jwt.SignOptions["expiresIn"],
    refreshExpiresIn: refreshExpiresIn as jwt.SignOptions["expiresIn"],
  };
}

function isJWTPayload(obj: any): obj is JwtPayload {
  return (
    obj &&
    typeof obj === "object" &&
    "userId" in obj &&
    "email" in obj &&
    "type" in obj
  );
}

export class JwtService {
  private static readonly jwtConfig = mapJWTConfig();
  /**
   * Generate access token for user
   */
  static generateAccessToken(userId: string, email: string): string {
    try {
      const payload = {
        userId,
        email,
        type: "access" as const,
      };

      return jwt.sign(payload, this.jwtConfig.secret, {
        expiresIn: this.jwtConfig.expiresIn,
        issuer: "todo-api",
        subject: userId,
      });
    } catch (error) {
      logger.error("Error generating access token:", error);
      throw new Error("Failed to generate access token");
    }
  }

  /**
   * Generate refresh token for user
   */
  static generateRefreshToken(userId: string, email: string): string {
    try {
      const payload = {
        userId,
        email,
        type: "refresh",
      };

      return jwt.sign(payload, this.jwtConfig.secret, {
        expiresIn: this.jwtConfig.refreshExpiresIn,
        issuer: "todo-api",
        subject: userId,
      });
    } catch (error) {
      logger.error("Error generating refresh token:", error);
      throw new Error("Failed to generate refresh token");
    }
  }

  /**
   * Verify and decode JWT token
   */
  static verifyToken(token: string): JwtPayload {
    try {
      const decoded = jwt.verify(token, this.jwtConfig.secret);
      if (!isJWTPayload(decoded)) {
        throw new Error("Invalid token payload");
      }
      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error("Token expired");
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw new Error("Invalid token");
      } else {
        logger.error("Error verifying token:", error);
        throw new Error("Token verification failed");
      }
    }
  }

  /**
   * Decode token without verification (for debugging purposes)
   */
  static decodeToken(token: string): JwtPayload | null {
    try {
      return jwt.decode(token) as JwtPayload;
    } catch (error) {
      logger.error("Error decoding token:", error);
      return null;
    }
  }

  /**
   * Get token expiration time
   */
  static getTokenExpiration(token: string): Date | null {
    try {
      const decoded = this.decodeToken(token);
      if (decoded && decoded.exp) {
        return new Date(decoded.exp * 1000);
      }
      return null;
    } catch (error) {
      logger.error("Error getting token expiration:", error);
      return null;
    }
  }

  /**
   * Check if token is expired
   */
  static isTokenExpired(token: string): boolean {
    try {
      const expiration = this.getTokenExpiration(token);
      if (!expiration) return true;
      return expiration < new Date();
    } catch (error) {
      logger.error("Error checking token expiration:", error);
      return true;
    }
  }

  /**
   * Generate token pair (access + refresh)
   */
  static generateTokenPair(
    userId: string,
    email: string
  ): {
    accessToken: string;
    refreshToken: string;
  } {
    return {
      accessToken: this.generateAccessToken(userId, email),
      refreshToken: this.generateRefreshToken(userId, email),
    };
  }
}
