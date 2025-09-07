import { Router } from "express";
import {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
} from "../controllers/todoController";

const router = Router();

/**
 * @route   GET /api/todos
 * @desc    Get all todos
 * @access  Public
 */
router.get("/", getAllTodos);

/**
 * @route   GET /api/todos/:id
 * @desc    Get todo by ID
 * @access  Public
 */
router.get("/:id", getTodoById);

/**
 * @route   POST /api/todos
 * @desc    Create new todo
 * @access  Public
 */
router.post("/", createTodo);

/**
 * @route   PUT /api/todos/:id
 * @desc    Update todo
 * @access  Public
 */
router.put("/:id", updateTodo);

/**
 * @route   DELETE /api/todos/:id
 * @desc    Delete todo
 * @access  Public
 */
router.delete("/:id", deleteTodo);

export default router;
