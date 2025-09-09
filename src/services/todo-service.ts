import { TodoRepository } from "../repositories/todo-repository";
import {
  CreateTodoRequest,
  Todo,
  UpdateTodoRequest,
} from "../interfaces/todo.interface";

export class TodoService {
  constructor(private todoRepository: TodoRepository) {}

  public getAllTodos(): Todo[] {
    return this.todoRepository.getAllTodos();
  }

  public getTodoById(id: string): Todo | undefined {
    return this.todoRepository.getTodoById(id);
  }

  public createTodo(data: CreateTodoRequest): Todo {
    return this.todoRepository.createTodo(data);
  }

  public updateTodo(id: string, data: UpdateTodoRequest): Todo | undefined {
    return this.todoRepository.updateTodo(id, data);
  }

  public deleteTodo(id: string): boolean {
    return this.todoRepository.deleteTodo(id);
  }
}
