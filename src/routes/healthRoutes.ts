import { Router } from "express";
import { HealthController } from "../controllers/healthController";

/**
 * Health check routes
 * Provides endpoints for application health monitoring
 */
const healthRoutes = Router();

/**
 * @swagger
 * /api/v1/health:
 *   get:
 *     summary: Get application health status
 *     description: Returns the health status of the application for monitoring and load balancing
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Application is healthy
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
healthRoutes.get("/health", HealthController.getHealth);

/**
 * @swagger
 * /api/v1/health/readiness:
 *   get:
 *     summary: Get application readiness status
 *     description: Kubernetes readiness probe endpoint - indicates if the application is ready to serve traffic
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Application is ready
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
healthRoutes.get("/health/readiness", HealthController.getHealth);

/**
 * @swagger
 * /api/v1/health/liveness:
 *   get:
 *     summary: Get application liveness status
 *     description: Kubernetes liveness probe endpoint - indicates if the application is alive
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Application is alive
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
healthRoutes.get("/health/liveness", HealthController.getHealth);

export { healthRoutes };
