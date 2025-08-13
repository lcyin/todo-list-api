import { Router } from "express";
import { TodoController } from "../controllers/todoController";
import { TodoService } from "../services/TodoService";
import { PostgresTodoRepository } from "../adapters/secondary/PostgresTodoRepository";

/**
 * Todo routes
 * Provides endpoints for todo management
 */
const todoRoutes = Router();

// Dependency injection - wire up the hexagonal architecture
const todoRepository = new PostgresTodoRepository();
const todoService = new TodoService(todoRepository);
const todoController = new TodoController(todoService);

/**
 * @swagger
 * /api/v1/todos:
 *   get:
 *     summary: Get all todos
 *     description: Retrieve a paginated list of todos with optional filtering
 *     tags: [Todos]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: completed
 *         schema:
 *           type: boolean
 *         description: Filter by completion status
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in title and description
 *     responses:
 *       200:
 *         description: List of todos retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TodosResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
todoRoutes.get("/todos", todoController.getTodos);

/**
 * @swagger
 * /api/v1/todos/{id}:
 *   get:
 *     summary: Get a todo by ID
 *     description: Retrieve a specific todo by its unique identifier
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the todo
 *         example: "todo-123"
 *     responses:
 *       200:
 *         description: Todo retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
todoRoutes.get("/todos/:id", todoController.getTodoById);

/**
 * @swagger
 * /api/v1/todos:
 *   post:
 *     summary: Create a new todo
 *     description: Create a new todo item with title and optional description
 *     tags: [Todos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTodoRequest'
 *           examples:
 *             simple:
 *               summary: Simple todo with title only
 *               value:
 *                 title: "Complete project documentation"
 *             detailed:
 *               summary: Todo with title and description
 *               value:
 *                 title: "Complete project documentation"
 *                 description: "Write comprehensive documentation for the todo API project"
 *     responses:
 *       201:
 *         description: Todo created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
todoRoutes.post("/todos", todoController.createTodo);

/**
 * @swagger
 * /api/v1/todos/{id}:
 *   put:
 *     summary: Update a todo
 *     description: Update an existing todo with new information
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the todo
 *         example: "todo-123"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTodoRequest'
 *           examples:
 *             title_only:
 *               summary: Update title only
 *               value:
 *                 title: "Updated todo title"
 *             complete_todo:
 *               summary: Mark as completed
 *               value:
 *                 completed: true
 *             full_update:
 *               summary: Update all fields
 *               value:
 *                 title: "Updated todo title"
 *                 description: "Updated description"
 *                 completed: true
 *     responses:
 *       200:
 *         description: Todo updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
todoRoutes.put("/todos/:id", todoController.updateTodo);

/**
 * @swagger
 * /api/v1/todos/{id}:
 *   delete:
 *     summary: Delete a todo
 *     description: Delete a specific todo by its unique identifier
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the todo
 *         example: "todo-123"
 *     responses:
 *       204:
 *         description: Todo deleted successfully (no content)
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
todoRoutes.delete("/todos/:id", todoController.deleteTodo);

export { todoRoutes };
