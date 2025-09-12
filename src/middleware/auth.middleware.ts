import { Request, Response, NextFunction } from 'express';
import { JwtService } from '../services/jwt.service';
import { ErrorCode } from './enums/error-code.enum';
import logger from '../config/logger';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    createdAt: Date;
    updatedAt: Date;
  };
}

/**
 * Middleware to authenticate JWT tokens
 * Extracts and verifies JWT token from Authorization header
 * Adds user information to request object if token is valid
 */
export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    // Check if Authorization header exists
    if (!authHeader) {
      next({
        type: ErrorCode.AUTHENTICATION_ERROR,
        message: 'Authorization header is required',
        statusCode: 401,
      });
      return;
    }

    // Check if it follows Bearer token format
    if (!authHeader.startsWith('Bearer ')) {
      next({
        type: ErrorCode.AUTHENTICATION_ERROR,
        message: 'Authorization header must be in Bearer token format',
        statusCode: 401,
      });
      return;
    }

    // Extract token from "Bearer <token>"
    const token = authHeader.substring(7);
    
    if (!token) {
      next({
        type: ErrorCode.AUTHENTICATION_ERROR,
        message: 'Token is required',
        statusCode: 401,
      });
      return;
    }

    // Verify and decode token
    let decodedToken;
    try {
      decodedToken = JwtService.verifyToken(token);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Token verification failed';
      next({
        type: ErrorCode.AUTHENTICATION_ERROR,
        message: errorMessage,
        statusCode: 401,
      });
      return;
    }

    // Add user information to request object
    // Note: In a complete implementation, you might want to fetch full user details from database
    req.user = {
      id: decodedToken.userId,
      email: decodedToken.email,
      firstName: '', // These would be fetched from database in a complete implementation
      lastName: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    logger.debug(`User authenticated: ${decodedToken.email} (${decodedToken.userId})`);
    next();
  } catch (error) {
    logger.error('Authentication middleware error:', error);
    next({
      type: ErrorCode.INTERNAL_SERVER_ERROR,
      message: 'Authentication failed',
      statusCode: 500,
    });
  }
};

/**
 * Optional authentication middleware
 * Similar to authenticateToken but doesn't fail if no token is provided
 * Useful for endpoints that have optional authentication
 */
export const optionalAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    // If no auth header, continue without authentication
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      next();
      return;
    }

    const token = authHeader.substring(7);
    
    if (!token) {
      next();
      return;
    }

    // Try to verify token, but don't fail if it's invalid
    try {
      const decodedToken = JwtService.verifyToken(token);
      req.user = {
        id: decodedToken.userId,
        email: decodedToken.email,
        firstName: '',
        lastName: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      logger.debug(`Optional auth - User authenticated: ${decodedToken.email}`);
    } catch (error) {
      logger.debug('Optional auth - Invalid token provided, continuing without authentication');
    }

    next();
  } catch (error) {
    logger.error('Optional authentication middleware error:', error);
    next();
  }
};
