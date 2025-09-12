import { Request, Response } from "express";
import {
  Todo,
  CreateTodoRequest,
  UpdateTodoRequest,
  ApiResponse,
} from "../interfaces/todo.interface";
import { TodoService } from "../services/todo-service";
import { ErrorCode } from "../middleware/enums/error-code.enum";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import {
  TodoResponseSchema,
  TodoSchema,
  TodosResponseSchema,
} from "../schemas/todo.schema";
import z from "zod";

export class TodoController {
  constructor(private todoService: TodoService) {
    this.todoService = todoService;
  }
  public getAllTodos = async (
    req: AuthenticatedRequest,
    res: Response,
    next: Function
  ): Promise<void> => {
    try {
      if (!req.user?.id) {
        next({
          type: ErrorCode.AUTHENTICATION_ERROR,
          message: 'User not authenticated',
        });
        return;
      }

      const todoRaws = await this.todoService.getAllTodos(req.user.id);
      const todos: Todo[] = z
        .array(TodoSchema)
        .parse(todoRaws.map((todo) => TodoSchema.parse(todo)));

      const response = TodosResponseSchema.parse({
        success: true,
        data: todos,
        message: "Todos retrieved successfully",
      });

      res.json(response);
    } catch (error) {
      next(error);
    }
  };
  public getTodoById = async (
    req: AuthenticatedRequest,
    res: Response,
    next: Function
  ): Promise<Response<ApiResponse<Todo>> | undefined> => {
    const { id } = req.params; // Extract ID from request parameters
    
    if (!req.user?.id) {
      next({
        type: ErrorCode.AUTHENTICATION_ERROR,
        message: 'User not authenticated',
      });
      return;
    }

    const todoOrString = await this.todoService.getTodoById(id, req.user.id); // Use service to get todo by ID

    if (typeof todoOrString === "string") {
      next({
        type: ErrorCode.TODO_NOT_FOUND,
        message: `Todo not found, id: ${id}`,
      });
      return;
    }
    const todo = todoOrString;
    const response = TodoResponseSchema.parse({
      success: true,
      data: TodoSchema.parse(todo),
      message: "Todo retrieved successfully",
    });
    return res.json(response);
  };
  public createTodo = async (
    req: AuthenticatedRequest,
    res: Response,
    next: Function
  ) => {
    try {
      if (!req.user?.id) {
        next({
          type: ErrorCode.AUTHENTICATION_ERROR,
          message: 'User not authenticated',
        });
        return;
      }

      const { title, description } = req.body;

      // Validation is now handled by Zod middleware
      const newTodo = await this.todoService.createTodo({ title, description }, req.user.id);
      const response = TodoResponseSchema.parse({
        success: true,
        data: TodoSchema.parse(newTodo),
        message: "Todo created successfully",
      });

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  };

  public updateTodo = async (
    req: AuthenticatedRequest,
    res: Response,
    next: Function
  ): Promise<Response<ApiResponse<Todo>> | undefined> => {
    const { id } = req.params;
    const { title, description, completed } = req.body;

    if (!req.user?.id) {
      next({
        type: ErrorCode.AUTHENTICATION_ERROR,
        message: 'User not authenticated',
      });
      return;
    }

    const updatedTodoOrError = await this.todoService.updateTodo(id, {
      title,
      description,
      completed,
    }, req.user.id);

    if (typeof updatedTodoOrError === "string") {
      next({
        type:
          updatedTodoOrError === `Todo not found, id: ${id}`
            ? ErrorCode.TODO_NOT_FOUND
            : ErrorCode.INVALID_TODO_STATE,
        message: updatedTodoOrError,
      });
      return;
    }
    const updatedTodo = updatedTodoOrError;
    const response = TodoResponseSchema.parse({
      success: true,
      data: TodoSchema.parse(updatedTodo),
      message: "Todo updated successfully",
    });
    return res.json(response);
  };

  public deleteTodo = async (
    req: Request,
    res: Response,
    next: Function
  ): Promise<Response<ApiResponse<null>> | undefined> => {
    const { id } = req.params;
    const deletedOrError = await this.todoService.deleteTodo(id);

    if (typeof deletedOrError === "string") {
      next({
        type: ErrorCode.TODO_NOT_FOUND,
        message: `Todo not found, id: ${id}`,
      });
      return;
    }
    const response = TodosResponseSchema.parse({
      success: true,
      data: [],
      message: "Todo deleted successfully",
    });
    return res.json(response);
  };
}
