import { Request, Response } from "express";
import {
  Todo,
  CreateTodoRequest,
  UpdateTodoRequest,
  ApiResponse,
} from "../types/todo-route";
import { TodoService } from "../services/todo-service";

export class TodoController {
  constructor(private todoService: TodoService) {
    this.todoService = todoService;
  }
  public getAllTodos = (
    req: Request,
    res: Response
  ): Response<ApiResponse<Todo[]>> => {
    const todos = this.todoService.getAllTodos();
    return res.json({
      success: true,
      data: todos,
      message: "Todos retrieved successfully",
    });
  };
  public getTodoById = (
    req: Request,
    res: Response
  ): Response<ApiResponse<Todo>> => {
    const { id } = req.params; // Extract ID from request parameters
    const todo = this.todoService.getTodoById(id); // Use service to get todo by ID

    if (!todo) {
      return res.status(404).json({
        success: false,
        error: "Todo not found",
      });
    }

    return res.json({
      success: true,
      data: todo,
      message: "Todo retrieved successfully",
    });
  };
  public createTodo = (
    req: Request<{}, {}, CreateTodoRequest>,
    res: Response
  ): Response<ApiResponse<Todo>> => {
    const { title, description } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({
        success: false,
        error: "Title is required",
      });
    }

    const newTodo = this.todoService.createTodo({ title, description });

    return res.status(201).json({
      success: true,
      data: newTodo,
      message: "Todo created successfully",
    });
  };

  public updateTodo = (
    req: Request<{ id: string }, {}, UpdateTodoRequest>,
    res: Response
  ): Response<ApiResponse<Todo>> => {
    const { id } = req.params;
    const { title, description, completed } = req.body;

    const updatedTodo = this.todoService.updateTodo(id, {
      title,
      description,
      completed,
    });

    if (!updatedTodo) {
      return res.status(404).json({
        success: false,
        error: "Todo not found",
      });
    }

    return res.json({
      success: true,
      data: updatedTodo,
      message: "Todo updated successfully",
    });
  };

  public deleteTodo = (
    req: Request,
    res: Response
  ): Response<ApiResponse<null>> => {
    const { id } = req.params;
    const deleted = this.todoService.deleteTodo(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: "Todo not found",
      });
    }

    return res.json({
      success: true,
      data: null,
      message: "Todo deleted successfully",
    });
  };
}
