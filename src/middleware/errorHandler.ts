import { Request, Response, NextFunction } from "express";
import { ErrorCode } from "./enums/error-code.enum";
import { ErrorDetails } from "./interfaces/errore-interface";

export interface CustomError extends Error {
  statusCode?: number;
  type: ErrorCode;
  details?: ErrorDetails[];
}

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  const defaultStatusCode = 500;
  const defaultMessage = "Internal Server Error";
  const errorResponse = process.env.NODE_ENV === "development" && {
    stack: err.stack,
  };

  console.error("Error:", {
    type: err.type,
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString(),
    details: err.details || undefined,
  });

  switch (err.type) {
    case ErrorCode.VALIDATION_ERROR:
      return res.status(400).json({
        success: false,
        error: err.message,
        ...errorResponse,
      });
    case ErrorCode.DATABASE_ERROR:
      return res.status(500).json({
        success: false,
        error: "Database error occurred",
        ...errorResponse,
      });
    default:
      return res.status(defaultStatusCode).json({
        success: false,
        error: defaultMessage,
        ...errorResponse,
      });
  }
};
