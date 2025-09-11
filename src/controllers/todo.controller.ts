import { Request, Response } from "express";
import {
  Todo,
  CreateTodoRequest,
  UpdateTodoRequest,
  ApiResponse,
} from "../interfaces/todo.interface";
import { TodoService } from "../services/todo-service";
import { ErrorCode } from "../middleware/enums/error-code.enum";

export class TodoController {
  constructor(private todoService: TodoService) {
    this.todoService = todoService;
  }
  public getAllTodos = async (
    req: Request,
    res: Response,
    next: Function
  ): Promise<void> => {
    try {
      const todos = await this.todoService.getAllTodos();
      res.json({
        success: true,
        data: todos,
        message: "Todos retrieved successfully",
      });
    } catch (error) {
      next(error);
    }
  };
  public getTodoById = async (
    req: Request,
    res: Response,
    next: Function
  ): Promise<Response<ApiResponse<Todo>> | undefined> => {
    const { id } = req.params; // Extract ID from request parameters
    const todo = await this.todoService.getTodoById(id); // Use service to get todo by ID

    if (!todo) {
      next({
        type: ErrorCode.TODO_NOT_FOUND,
        message: `Todo not found, id: ${id}`,
      });
      return;
    }

    return res.json({
      success: true,
      data: todo,
      message: "Todo retrieved successfully",
    });
  };
  public createTodo = async (
    req: Request<{}, {}, CreateTodoRequest>,
    res: Response,
    next: Function
  ) => {
    try {
      const { title, description } = req.body;

      // Validation is now handled by Zod middleware
      const newTodo = await this.todoService.createTodo({ title, description });

      res.status(201).json({
        success: true,
        data: newTodo,
        message: "Todo created successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  public updateTodo = (
    req: Request<{ id: string }, {}, UpdateTodoRequest>,
    res: Response,
    next: Function
  ): Response<ApiResponse<Todo>> | undefined => {
    const { id } = req.params;
    const { title, description, completed } = req.body;

    const foundTodo = this.todoService.getTodoById(id) as any;

    if (!foundTodo) {
      next({
        type: ErrorCode.TODO_NOT_FOUND,
        message: `Todo not found, id: ${id}`,
      });
      return;
    }

    if (foundTodo.completed && completed === false) {
      next({
        type: ErrorCode.INVALID_TODO_STATE,
        message: "Cannot mark a completed todo as incomplete",
      });
      return;
    }

    if (
      foundTodo.completed &&
      (description !== undefined || title !== undefined)
    ) {
      next({
        type: ErrorCode.INVALID_TODO_STATE,
        message: "Cannot update a completed todo",
      });
      return;
    }

    const updatedTodo = this.todoService.updateTodo(id, {
      title,
      description,
      completed,
    });

    return res.json({
      success: true,
      data: updatedTodo,
      message: "Todo updated successfully",
    });
  };

  public deleteTodo = (
    req: Request,
    res: Response,
    next: Function
  ): Response<ApiResponse<null>> | undefined => {
    const { id } = req.params;
    const deleted = this.todoService.deleteTodo(id);

    if (!deleted) {
      next({
        type: ErrorCode.TODO_NOT_FOUND,
        message: `Todo not found, id: ${id}`,
      });
      return;
    }

    return res.json({
      success: true,
      data: null,
      message: "Todo deleted successfully",
    });
  };
}
