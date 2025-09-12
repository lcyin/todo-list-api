import { Request, Response, NextFunction } from "express";
import { ErrorCode } from "./enums/error-code.enum";
import { ErrorDetails } from "./interfaces/errore-interface";
import logger from "../config/logger";
import { ErrorResponseSchema } from "../schemas/todo.schema";

interface LoggingRequest extends Request {
  requestId?: string;
}

export interface CustomError extends Error {
  statusCode?: number;
  type: ErrorCode;
  details?: ErrorDetails[];
}

export const errorHandler = (
  err: CustomError,
  req: LoggingRequest,
  res: Response,
  next: NextFunction
): Response | void => {
  const defaultStatusCode = 500;
  const defaultMessage = "Internal Server Error";
  const errorResponse = process.env.NODE_ENV === "development" && {
    stack: err.stack,
  };

  // Determine status code and error message based on error type
  let statusCode = defaultStatusCode;
  let errorMessage = defaultMessage;

  switch (err.type) {
    case ErrorCode.VALIDATION_ERROR:
    case ErrorCode.INVALID_TODO_STATE:
      statusCode = 400;
      errorMessage = err.message;
      break;
    case ErrorCode.TODO_NOT_FOUND:
    case ErrorCode.USER_NOT_FOUND:
      statusCode = 404;
      errorMessage = err.message;
      break;
    case ErrorCode.AUTHENTICATION_ERROR:
    case ErrorCode.UNAUTHORIZED:
      statusCode = 401;
      errorMessage = err.message;
      break;
    case ErrorCode.FORBIDDEN:
      statusCode = 403;
      errorMessage = err.message;
      break;
    case ErrorCode.USER_ALREADY_EXISTS:
    case ErrorCode.INVALID_CREDENTIALS:
      statusCode = 400;
      errorMessage = err.message;
      break;
    case ErrorCode.DATABASE_ERROR:
      statusCode = 500;
      errorMessage = "Database error occurred";
      break;
    default:
      statusCode = err.statusCode || defaultStatusCode;
      errorMessage = err.message || defaultMessage;
  }

  // Log error with context
  const errorLog = {
    requestId: req.requestId,
    method: req.method,
    url: req.url,
    statusCode,
    errorType: err.type || "UNKNOWN",
    errorMessage: err.message,
    stack: err.stack,
    details: err.details,
  };

  if (statusCode >= 500) {
    logger.error("Server Error", errorLog);
  } else {
    logger.warn("Client Error", errorLog);
  }

  const response = ErrorResponseSchema.parse({
    success: false,
    error: errorMessage,
    stack: err.stack,
  });

  return res.status(statusCode).json(response);
};
