import { Router } from "express";
import { RestTodoController } from "../adapters/primary/RestTodoController";
import { GetTodosService } from "../services/GetTodosService";
import { InMemoryTodoRepository } from "../adapters/secondary/InMemoryTodoRepository";

/**
 * Todo routes
 * Provides endpoints for todo management
 */
const todoRoutes = Router();

// Dependency injection - wire up the hexagonal architecture
const todoRepository = new InMemoryTodoRepository();
const getTodosUseCase = new GetTodosService(todoRepository);
const todoController = new RestTodoController(getTodosUseCase);

/**
 * GET /api/v1/todos
 * Get all todos with optional filtering and pagination
 *
 * Query parameters:
 * - page: Page number (default: 1)
 * - limit: Items per page (default: 10, max: 100)
 * - completed: Filter by completion status (true/false)
 * - search: Search in title and description
 */
todoRoutes.get("/todos", todoController.getTodos);

export { todoRoutes };
