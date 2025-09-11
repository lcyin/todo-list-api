import { TodoRepository } from "../repositories/todo.repository";
import {
  CreateTodoRequest,
  Todo,
  UpdateTodoRequest,
} from "../interfaces/todo.interface";

export class TodoService {
  constructor(private todoRepository: TodoRepository) {}

  public async getAllTodos(): Promise<Todo[]> {
    return this.todoRepository.getAllTodos();
  }

  public async getTodoById(id: string): Promise<Todo | string> {
    const todo = await this.todoRepository.getTodoById(id);
    if (!todo) {
      return `Todo not found, id: ${id}`;
    }
    return todo;
  }

  public async createTodo(data: CreateTodoRequest): Promise<Todo> {
    return this.todoRepository.createTodo(data);
  }

  public async updateTodo(
    id: string,
    data: UpdateTodoRequest
  ): Promise<Todo | string> {
    const foundTodo = await this.todoRepository.getTodoById(id);
    if (!foundTodo) {
      return `Todo not found, id: ${id}`;
    }
    // Cannot update an complete todo
    if (foundTodo.completed) {
      return `Cannot update a completed todo`;
    }
    const updatedData = {
      title: data.title ?? foundTodo.title,
      description: data.description ?? foundTodo.description ?? "",
      completed: data.completed ?? foundTodo.completed,
    };
    return this.todoRepository.updateTodo(id, updatedData);
  }

  public async deleteTodo(id: string): Promise<boolean | string> {
    const foundTodo = await this.todoRepository.getTodoById(id);
    if (!foundTodo) {
      return `Todo not found, id: ${id}`;
    }
    const result = await this.todoRepository.deleteTodo(id);
    return result;
  }
}
