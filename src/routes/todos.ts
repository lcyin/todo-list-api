import { Router } from "express";
import { TodoService } from "../services/todo-service";
import { TodoController } from "../controllers/todo-controller";
import { TodoRepository } from "../repositories/todo-repository";

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
router.get("/:id", todoController.getTodoById);

/**
 * @route   POST /api/todos
 * @desc    Create new todo
 * @access  Public
 */
router.post("/", todoController.createTodo);

/**
 * @route   PUT /api/todos/:id
 * @desc    Update todo
 * @access  Public
 */
router.put("/:id", todoController.updateTodo);

/**
 * @route   DELETE /api/todos/:id
 * @desc    Delete todo
 * @access  Public
 */
router.delete("/:id", todoController.deleteTodo);

export default router;
