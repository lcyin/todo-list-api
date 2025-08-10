import { Router } from "express";
import { RestTodoController } from "../adapters/primary/RestTodoController";
import { GetTodosService } from "../services/GetTodosService";
import { GetTodoByIdService } from "../services/GetTodoByIdService";
import { CreateTodoService } from "../services/CreateTodoService";
import { UpdateTodoService } from "../services/UpdateTodoService";
import { DeleteTodoService } from "../services/DeleteTodoService";
import { InMemoryTodoRepository } from "../adapters/secondary/InMemoryTodoRepository";

/**
 * Todo routes
 * Provides endpoints for todo management
 */
const todoRoutes = Router();

// Dependency injection - wire up the hexagonal architecture
const todoRepository = new InMemoryTodoRepository();
const getTodosUseCase = new GetTodosService(todoRepository);
const getTodoByIdUseCase = new GetTodoByIdService(todoRepository);
const createTodoUseCase = new CreateTodoService(todoRepository);
const updateTodoUseCase = new UpdateTodoService(todoRepository);
const deleteTodoUseCase = new DeleteTodoService(todoRepository);
const todoController = new RestTodoController(
  getTodosUseCase,
  getTodoByIdUseCase,
  createTodoUseCase,
  updateTodoUseCase,
  deleteTodoUseCase
);

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

/**
 * GET /api/v1/todos/:id
 * Get a specific todo by ID
 *
 * Path parameters:
 * - id: Todo ID (string)
 */
todoRoutes.get("/todos/:id", todoController.getTodoById);

/**
 * POST /api/v1/todos
 * Create a new todo
 *
 * Request body:
 * - title: Todo title (required, string, max 200 chars)
 * - description: Todo description (optional, string, max 1000 chars)
 */
todoRoutes.post("/todos", todoController.createTodo);

/**
 * PUT /api/v1/todos/:id
 * Update an existing todo
 *
 * Path parameters:
 * - id: Todo ID (string)
 *
 * Request body:
 * - title: Todo title (optional, string, max 200 chars)
 * - description: Todo description (optional, string, max 1000 chars)
 * - completed: Todo completion status (optional, boolean)
 */
todoRoutes.put("/todos/:id", todoController.updateTodo);

/**
 * DELETE /api/v1/todos/:id
 * Delete a todo
 *
 * Path parameters:
 * - id: Todo ID (string)
 */
todoRoutes.delete("/todos/:id", todoController.deleteTodo);

export { todoRoutes };
