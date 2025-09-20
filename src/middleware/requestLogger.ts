import { Request, Response, NextFunction } from "express";
import logger from "../loggers/logger";

interface LoggingRequest extends Request {
  requestId?: string;
  startTime?: number;
}

// Generate unique request ID
const generateRequestId = (): string => {
  return `req_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
};

// Log request details
const logRequest = (req: LoggingRequest): void => {
  const { method, url, headers, body, query, params } = req;

  const requestLog = {
    requestId: req.requestId,
    method,
    url,
    userAgent: headers["user-agent"],
    ip: req.ip || req.socket?.remoteAddress || "unknown",
    contentType: headers["content-type"],
    ...(Object.keys(query).length > 0 && { query }),
    ...(Object.keys(params).length > 0 && { params }),
    ...(method !== "GET" && body && { body }),
  };

  logger.info(`Incoming ${method} ${url}`, requestLog);
};

// Log response details
const logResponse = (
  req: LoggingRequest,
  res: Response,
  responseTime: number
): void => {
  const { statusCode } = res;
  const contentLength = res.get("content-length") || 0;

  const responseLog = {
    requestId: req.requestId,
    method: req.method,
    url: req.url,
    statusCode,
    responseTime: `${responseTime}ms`,
    contentLength: `${contentLength} bytes`,
  };

  // Log level based on status code
  if (statusCode >= 500) {
    logger.error(
      `Response ${statusCode} ${req.method} ${req.url}`,
      responseLog
    );
  } else if (statusCode >= 400) {
    logger.warn(`Response ${statusCode} ${req.method} ${req.url}`, responseLog);
  } else {
    logger.info(`Response ${statusCode} ${req.method} ${req.url}`, responseLog);
  }
};

// Main logging middleware
export const requestLogger = (
  req: LoggingRequest,
  res: Response,
  next: NextFunction
): void => {
  // Add request ID and start time
  req.requestId = generateRequestId();
  req.startTime = Date.now();

  // Log incoming request
  logRequest(req);

  // Override res.end to capture response
  const originalEnd = res.end;

  res.end = function (chunk?: any, encoding?: any, cb?: any): Response {
    const responseTime = Date.now() - (req.startTime || 0);
    logResponse(req, res, responseTime);

    // Call original end method
    return originalEnd.call(this, chunk, encoding, cb);
  };

  next();
};

// Request ID middleware (adds request ID to response headers)
export const addRequestId = (
  req: LoggingRequest,
  res: Response,
  next: NextFunction
): void => {
  if (req.requestId) {
    res.set("X-Request-ID", req.requestId);
  }
  next();
};
