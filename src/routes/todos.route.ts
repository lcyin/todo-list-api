import { Router } from "express";
import { TodoService } from "../services/todos.service";
import { TodoController } from "../controllers/todos.controller";
import { TodoRepository } from "../repositories/todos.repository";
import { authenticateToken } from "../middleware/auth.middleware";
import {
  validate,
  validateBody,
  validateParams,
} from "../middleware/validation";
import {
  createTodoSchema,
  updateTodoSchema,
  todoParamsSchema,
} from "../schemas/todos.schema";

const router = Router();
const todoRepository = new TodoRepository();
const todoService = new TodoService(todoRepository);
const todoController = new TodoController(todoService);

/**
 * @route   GET /api/todos
 * @desc    Get all todos for authenticated user
 * @access  Private
 */
router.get("/", authenticateToken, todoController.getAllTodos);

/**
 * @route   GET /api/todos/:id
 * @desc    Get todo by ID for authenticated user
 * @access  Private
 */
router.get(
  "/:id",
  authenticateToken,
  validateParams(todoParamsSchema),
  todoController.getTodoById
);

/**
 * @route   POST /api/todos
 * @desc    Create new todo for authenticated user
 * @access  Private
 */
router.post("/", authenticateToken, validate(createTodoSchema), todoController.createTodo);

/**
 * @route   PUT /api/todos/:id
 * @desc    Update todo for authenticated user
 * @access  Private
 */
router.put("/:id", authenticateToken, validate(updateTodoSchema), todoController.updateTodo);

/**
 * @route   DELETE /api/todos/:id
 * @desc    Delete todo for authenticated user
 * @access  Private
 */
router.delete(
  "/:id",
  authenticateToken,
  validateParams(todoParamsSchema),
  todoController.deleteTodo
);

export default router;
