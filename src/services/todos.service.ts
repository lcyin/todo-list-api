import { TodoRepository } from "../repositories/todos.repository";
import {
  CreateTodoRequest,
  Todo,
  UpdateTodoRequest,
} from "../interfaces/todos.interface";

export class TodoService {
  constructor(private todoRepository: TodoRepository) {}

  public async getAllTodos(userId: string): Promise<Todo[]> {
    return this.todoRepository.getAllTodos(userId);
  }

  public async getTodoById(id: string, userId: string): Promise<Todo | string> {
    const todo = await this.todoRepository.getTodoById(id, userId);
    if (!todo) {
      return `Todo not found, id: ${id}`;
    }
    return todo;
  }

  public async createTodo(data: CreateTodoRequest, userId: string): Promise<Todo> {
    return this.todoRepository.createTodo(data, userId);
  }

  public async updateTodo(
    id: string,
    data: UpdateTodoRequest,
    userId: string
  ): Promise<Todo | string> {
    const foundTodo = await this.todoRepository.getTodoById(id, userId);
    if (!foundTodo) {
      return `Todo not found, id: ${id}`;
    }
    
    // Cannot update a completed todo
    if (foundTodo.completed && data.completed !== false) {
      return `Cannot update a completed todo`;
    }

    const updatedData: any = {};
    if (data.title !== undefined) updatedData.title = data.title;
    if (data.description !== undefined) updatedData.description = data.description;
    if (data.completed !== undefined) updatedData.completed = data.completed;

    const updatedTodo = await this.todoRepository.updateTodo(id, updatedData, userId);
    if (!updatedTodo) {
      return `Todo not found, id: ${id}`;
    }
    
    return updatedTodo;
  }

  public async deleteTodo(id: string, userId: string): Promise<boolean | string> {
    const result = await this.todoRepository.deleteTodo(id, userId);
    if (!result) {
      return `Todo not found, id: ${id}`;
    }
    return result;
  }
}
