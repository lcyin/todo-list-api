import jwt from 'jsonwebtoken';
import { JwtPayload } from '../interfaces/auth.interface';
import { config } from '../config/config';
import logger from '../config/logger';

export class JwtService {
  private static readonly JWT_SECRET = config.jwtSecret;
  private static readonly JWT_EXPIRES_IN = config.jwtExpiresIn || '24h';
  private static readonly JWT_REFRESH_EXPIRES_IN = config.jwtRefreshExpiresIn || '7d';

  /**
   * Generate access token for user
   */
  static generateAccessToken(userId: string, email: string): string {
    try {
      const payload = {
        userId,
        email,
        type: 'access'
      };

      return jwt.sign(payload, this.JWT_SECRET, {
        expiresIn: this.JWT_EXPIRES_IN,
        issuer: 'todo-api',
        subject: userId,
      });
    } catch (error) {
      logger.error('Error generating access token:', error);
      throw new Error('Failed to generate access token');
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
        type: 'refresh'
      };

      return jwt.sign(payload, this.JWT_SECRET, {
        expiresIn: this.JWT_REFRESH_EXPIRES_IN,
        issuer: 'todo-api',
        subject: userId,
      });
    } catch (error) {
      logger.error('Error generating refresh token:', error);
      throw new Error('Failed to generate refresh token');
    }
  }

  /**
   * Verify and decode JWT token
   */
  static verifyToken(token: string): JwtPayload {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET) as JwtPayload;
      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Token expired');
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Invalid token');
      } else {
        logger.error('Error verifying token:', error);
        throw new Error('Token verification failed');
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
      logger.error('Error decoding token:', error);
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
      logger.error('Error getting token expiration:', error);
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
      logger.error('Error checking token expiration:', error);
      return true;
    }
  }

  /**
   * Generate token pair (access + refresh)
   */
  static generateTokenPair(userId: string, email: string): {
    accessToken: string;
    refreshToken: string;
  } {
    return {
      accessToken: this.generateAccessToken(userId, email),
      refreshToken: this.generateRefreshToken(userId, email),
    };
  }
}
