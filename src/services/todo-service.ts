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

  public async getTodoById(id: string): Promise<Todo | undefined> {
    return this.todoRepository.getTodoById(id);
  }

  public async createTodo(data: CreateTodoRequest): Promise<Todo> {
    return this.todoRepository.createTodo(data);
  }

  public updateTodo(id: string, data: UpdateTodoRequest): Todo | undefined {
    return this.todoRepository.updateTodo(id, data);
  }

  public deleteTodo(id: string): boolean {
    return this.todoRepository.deleteTodo(id);
  }
}
