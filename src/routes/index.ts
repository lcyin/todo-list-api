import { Router } from "express";
import { healthRoutes } from "./healthRoutes";
import { todoRoutes } from "./todoRoutes";

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

/**
 * Register todo routes
 * These handle all todo-related operations
 */
routes.use("/", todoRoutes);

export { routes };
