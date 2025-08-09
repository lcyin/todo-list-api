import { Request, Response } from "express";
import { GetTodosUseCase } from "../../domain/ports/TodoPorts";
import { TodoQueryParams } from "../../domain/TodoValueObjects";

/**
 * REST Controller for Todo endpoints
 * This is a primary adapter that handles HTTP requests
 */
export class RestTodoController {
  constructor(private readonly getTodosUseCase: GetTodosUseCase) {}

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
}
