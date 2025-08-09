import { Request, Response } from "express";
import { GetTodosUseCase, GetTodoByIdUseCase } from "../../domain/ports/TodoPorts";
import { TodoQueryParams } from "../../domain/TodoValueObjects";

/**
 * REST Controller for Todo endpoints
 * This is a primary adapter that handles HTTP requests
 */
export class RestTodoController {
  constructor(
    private readonly getTodosUseCase: GetTodosUseCase,
    private readonly getTodoByIdUseCase: GetTodoByIdUseCase
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
}
