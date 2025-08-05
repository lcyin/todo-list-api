import { Request, Response } from "express";
import { config } from "../config";

/**
 * Health check response interface
 */
interface HealthCheckResponse {
  status: "healthy" | "unhealthy";
  timestamp: string;
  version: string;
  environment: string;
  uptime: number;
}

/**
 * Health Check Controller
 * Handles health check endpoint for monitoring and load balancer health checks
 */
export class HealthController {
  /**
   * Get application health status
   * @param req Express request object
   * @param res Express response object
   */
  public static getHealth(req: Request, res: Response): void {
    try {
      const healthData: HealthCheckResponse = {
        status: "healthy",
        timestamp: new Date().toISOString(),
        version: config.api.version,
        environment: config.server.nodeEnv,
        uptime: process.uptime(),
      };

      res.status(200).json(healthData);
    } catch (error) {
      const errorResponse: HealthCheckResponse = {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        version: config.api.version,
        environment: config.server.nodeEnv,
        uptime: process.uptime(),
      };

      res.status(503).json(errorResponse);
    }
  }
}
