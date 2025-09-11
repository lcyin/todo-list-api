import { Request, Response } from "express";
import {
  Todo,
  CreateTodoRequest,
  UpdateTodoRequest,
  ApiResponse,
} from "../interfaces/todo.interface";
import { TodoService } from "../services/todo-service";
import { ErrorCode } from "../middleware/enums/error-code.enum";
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
    req: Request,
    res: Response,
    next: Function
  ): Promise<void> => {
    try {
      const todoRaws = await this.todoService.getAllTodos();
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
    req: Request,
    res: Response,
    next: Function
  ): Promise<Response<ApiResponse<Todo>> | undefined> => {
    const { id } = req.params; // Extract ID from request parameters
    const todoOrString = await this.todoService.getTodoById(id); // Use service to get todo by ID

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
    req: Request<{}, {}, CreateTodoRequest>,
    res: Response,
    next: Function
  ) => {
    try {
      const { title, description } = req.body;

      // Validation is now handled by Zod middleware
      const newTodo = await this.todoService.createTodo({ title, description });
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
    req: Request<{ id: string }, {}, UpdateTodoRequest>,
    res: Response,
    next: Function
  ): Promise<Response<ApiResponse<Todo>> | undefined> => {
    const { id } = req.params;
    const { title, description, completed } = req.body;

    const updatedTodoOrError = await this.todoService.updateTodo(id, {
      title,
      description,
      completed,
    });

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
    return res.json({
      success: true,
      data: updatedTodo,
      message: "Todo updated successfully",
    });
  };

  public deleteTodo = async (
    req: Request,
    res: Response,
    next: Function
  ): Promise<Response<ApiResponse<null>> | undefined> => {
    const { id } = req.params;
    const deletedOrError = await this.todoService.deleteTodo(id);

    if (!deletedOrError) {
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
