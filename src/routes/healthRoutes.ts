import { Router } from "express";
import { HealthController } from "../controllers/healthController";

/**
 * Health check routes
 * Provides endpoints for application health monitoring
 */
const healthRoutes = Router();

/**
 * GET /health
 * Returns application health status
 * Used by load balancers and monitoring systems
 */
healthRoutes.get("/health", HealthController.getHealth);

/**
 * GET /health/readiness
 * Alias for health check - commonly used by Kubernetes readiness probes
 */
healthRoutes.get("/health/readiness", HealthController.getHealth);

/**
 * GET /health/liveness
 * Alias for health check - commonly used by Kubernetes liveness probes
 */
healthRoutes.get("/health/liveness", HealthController.getHealth);

export { healthRoutes };
