import { Router } from "express";
import { TodoService } from "../services/todo-service";
import { TodoController } from "../controllers/todo.controller";
import { TodoRepository } from "../repositories/todo-repository";
import {
  validate,
  validateBody,
  validateParams,
} from "../middleware/validation";
import {
  createTodoSchema,
  updateTodoSchema,
  todoParamsSchema,
} from "../schemas/todo.schema";

const router = Router();
const todoRepository = new TodoRepository();
const todoService = new TodoService(todoRepository);
const todoController = new TodoController(todoService);

/**
 * @route   GET /api/todos
 * @desc    Get all todos
 * @access  Public
 */
router.get("/", todoController.getAllTodos);

/**
 * @route   GET /api/todos/:id
 * @desc    Get todo by ID
 * @access  Public
 */
router.get(
  "/:id",
  validateParams(todoParamsSchema),
  todoController.getTodoById
);

/**
 * @route   POST /api/todos
 * @desc    Create new todo
 * @access  Public
 */
router.post("/", validate(createTodoSchema), todoController.createTodo);

/**
 * @route   PUT /api/todos/:id
 * @desc    Update todo
 * @access  Public
 */
router.put("/:id", validate(updateTodoSchema), todoController.updateTodo);

/**
 * @route   DELETE /api/todos/:id
 * @desc    Delete todo
 * @access  Public
 */
router.delete(
  "/:id",
  validateParams(todoParamsSchema),
  todoController.deleteTodo
);

export default router;
