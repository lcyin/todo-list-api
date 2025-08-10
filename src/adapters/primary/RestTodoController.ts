import { Request, Response } from "express";
import {
  GetTodosUseCase,
  GetTodoByIdUseCase,
  CreateTodoUseCase,
  UpdateTodoUseCase,
  DeleteTodoUseCase,
} from "../../domain/ports/TodoPorts";
import { TodoQueryParams } from "../../domain/TodoValueObjects";

/**
 * REST Controller for Todo endpoints
 * This is a primary adapter that handles HTTP requests
 */
export class RestTodoController {
  constructor(
    private readonly getTodosUseCase: GetTodosUseCase,
    private readonly getTodoByIdUseCase: GetTodoByIdUseCase,
    private readonly createTodoUseCase: CreateTodoUseCase,
    private readonly updateTodoUseCase: UpdateTodoUseCase,
    private readonly deleteTodoUseCase: DeleteTodoUseCase
  ) {}

  /**
   * GET /api/v1/todos - Get all todos with optional filtering and pagination
   */
  public getTodos = async (req: Request, res: Response): Promise<void> => {
    try {
      // Convert Express query parameters to domain value object
      const queryParams = new TodoQueryParams(req.query);

      // Execute use case
      const result = await this.getTodosUseCase.execute(queryParams);

      // Return successful response
      res.status(200).json(result.toPlainObject());
    } catch (error) {
      // Handle validation errors (e.g., invalid query parameters)
      if (error instanceof Error && error.message.includes("cannot")) {
        res.status(400).json({
          error: {
            code: "INVALID_QUERY_PARAMETERS",
            message: error.message,
          },
        });
        return;
      }

      // Handle unexpected errors
      console.error("Error in getTodos:", error);
      res.status(500).json({
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred while fetching todos",
        },
      });
    }
  };

  /**
   * GET /api/v1/todos/:id - Get a specific todo by ID
   */
  public getTodoById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      // Execute use case
      const todo = await this.getTodoByIdUseCase.execute(id);

      // Handle todo not found
      if (!todo) {
        res.status(404).json({
          error: {
            code: "TODO_NOT_FOUND",
            message: `Todo with id '${id}' not found`,
          },
        });
        return;
      }

      // Return successful response
      res.status(200).json(todo.toPlainObject());
    } catch (error) {
      // Handle validation errors (e.g., empty ID)
      if (error instanceof Error && error.message.includes("cannot be empty")) {
        res.status(400).json({
          error: {
            code: "INVALID_TODO_ID",
            message: error.message,
          },
        });
        return;
      }

      // Handle unexpected errors
      console.error("Error in getTodoById:", error);
      res.status(500).json({
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred while fetching the todo",
        },
      });
    }
  };

  /**
   * POST /api/v1/todos - Create a new todo
   */
  public createTodo = async (req: Request, res: Response): Promise<void> => {
    try {
      const { title, description } = req.body;

      // Basic request validation
      if (!title || title.trim().length === 0) {
        res.status(400).json({
          error: {
            code: "MISSING_REQUIRED_FIELD",
            message: "Title is required",
          },
        });
        return;
      }

      // Execute use case
      const todo = await this.createTodoUseCase.execute({ title, description });

      // Return successful response
      res.status(201).json(todo.toPlainObject());
    } catch (error) {
      // Handle validation errors
      if (
        error instanceof Error &&
        (error.message.includes("cannot") || error.message.includes("exceed"))
      ) {
        res.status(400).json({
          error: {
            code: "INVALID_TODO_DATA",
            message: error.message,
          },
        });
        return;
      }

      // Handle unexpected errors
      console.error("Error in createTodo:", error);
      res.status(500).json({
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred while creating the todo",
        },
      });
    }
  };

  /**
   * PUT /api/v1/todos/:id - Update an existing todo
   */
  public updateTodo = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { title, description, completed } = req.body;

      // Execute use case
      const todo = await this.updateTodoUseCase.execute(id, { title, description, completed });

      // Handle todo not found
      if (!todo) {
        res.status(404).json({
          error: {
            code: "TODO_NOT_FOUND",
            message: `Todo with id '${id}' not found`,
          },
        });
        return;
      }

      // Return successful response
      res.status(200).json(todo.toPlainObject());
    } catch (error) {
      // Handle validation errors
      if (
        error instanceof Error &&
        (error.message.includes("cannot") || error.message.includes("exceed"))
      ) {
        res.status(400).json({
          error: {
            code: "INVALID_TODO_DATA",
            message: error.message,
          },
        });
        return;
      }

      // Handle unexpected errors
      console.error("Error in updateTodo:", error);
      res.status(500).json({
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred while updating the todo",
        },
      });
    }
  };

  /**
   * DELETE /api/v1/todos/:id - Delete a todo
   */
  public deleteTodo = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      // Execute use case
      const deleted = await this.deleteTodoUseCase.execute(id);

      // Handle todo not found
      if (!deleted) {
        res.status(404).json({
          error: {
            code: "TODO_NOT_FOUND",
            message: `Todo with id '${id}' not found`,
          },
        });
        return;
      }

      // Return successful response (204 No Content)
      res.status(204).send();
    } catch (error) {
      // Handle validation errors
      if (error instanceof Error && error.message.includes("cannot be empty")) {
        res.status(400).json({
          error: {
            code: "INVALID_TODO_ID",
            message: error.message,
          },
        });
        return;
      }

      // Handle unexpected errors
      console.error("Error in deleteTodo:", error);
      res.status(500).json({
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred while deleting the todo",
        },
      });
    }
  };
}
