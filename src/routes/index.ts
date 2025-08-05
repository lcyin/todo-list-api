import { Router } from "express";
import { healthRoutes } from "./healthRoutes";

/**
 * Central router configuration
 * Combines all route modules
 */
const routes = Router();

/**
 * Register health check routes
 * These are mounted at the root level for easy access by monitoring tools
 */
routes.use("/", healthRoutes);

export { routes };
