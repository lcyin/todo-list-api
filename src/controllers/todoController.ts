import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import {
  Todo,
  CreateTodoRequest,
  UpdateTodoRequest,
  ApiResponse,
} from "../types/todo";

// In-memory storage (replace with database in production)
let todos: Todo[] = [
  {
    id: "1",
    title: "Learn TypeScript",
    description: "Study TypeScript fundamentals and advanced concepts",
    completed: false,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    title: "Build Express API",
    description: "Create a RESTful API using Express and TypeScript",
    completed: true,
    createdAt: new Date("2024-01-02"),
    updatedAt: new Date("2024-01-02"),
  },
];

export const getAllTodos = (
  req: Request,
  res: Response
): Response<ApiResponse<Todo[]>> => {
  return res.json({
    success: true,
    data: todos,
    message: "Todos retrieved successfully",
  });
};

export const getTodoById = (
  req: Request,
  res: Response
): Response<ApiResponse<Todo>> => {
  const { id } = req.params;
  const todo = todos.find((t) => t.id === id);

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

export const createTodo = (
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

  const newTodo: Todo = {
    id: uuidv4(),
    title: title.trim(),
    description: description?.trim(),
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  todos.push(newTodo);

  return res.status(201).json({
    success: true,
    data: newTodo,
    message: "Todo created successfully",
  });
};

export const updateTodo = (
  req: Request<{ id: string }, {}, UpdateTodoRequest>,
  res: Response
): Response<ApiResponse<Todo>> => {
  const { id } = req.params;
  const { title, description, completed } = req.body;

  const todoIndex = todos.findIndex((t) => t.id === id);

  if (todoIndex === -1) {
    return res.status(404).json({
      success: false,
      error: "Todo not found",
    });
  }

  const existingTodo = todos[todoIndex];
  const updatedTodo: Todo = {
    ...existingTodo,
    ...(title !== undefined && { title: title.trim() }),
    ...(description !== undefined && { description: description?.trim() }),
    ...(completed !== undefined && { completed }),
    updatedAt: new Date(),
  };

  todos[todoIndex] = updatedTodo;

  return res.json({
    success: true,
    data: updatedTodo,
    message: "Todo updated successfully",
  });
};

export const deleteTodo = (
  req: Request,
  res: Response
): Response<ApiResponse<null>> => {
  const { id } = req.params;
  const todoIndex = todos.findIndex((t) => t.id === id);

  if (todoIndex === -1) {
    return res.status(404).json({
      success: false,
      error: "Todo not found",
    });
  }

  todos.splice(todoIndex, 1);

  return res.json({
    success: true,
    data: null,
    message: "Todo deleted successfully",
  });
};
