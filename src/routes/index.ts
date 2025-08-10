import { Router } from "express";
import { healthRoutes } from "./healthRoutes";
import { todoRoutes } from "./todoRoutes";
import { docsRoutes } from "./docsRoutes";

/**
 * Central router configuration
 * Combines all route modules
 */
const routes = Router();

/**
 * Register documentation routes
 * Provides API information and usage examples
 */
routes.use("/", docsRoutes);

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
