import {
  CreateTodoUseCase,
  DeleteTodoUseCase,
  GetTodoByIdUseCase,
  GetTodosUseCase,
  ITodoRepository,
  UpdateTodoUseCase,
} from "../domain/ports/TodoPorts";
import { Todo } from "../domain/Todo";
import { TodoQueryParams, PaginatedTodosResponse } from "../domain/TodoValueObjects";
import { createTodos } from "./components/create-todos.component";
import { getTodoById } from "./components/get-todo-by-id.component";
import { getTodosWithQueryParams } from "./components/get-todos.component";
import { CreateTodoService } from "./CreateTodoService";
import { DeleteTodoService } from "./DeleteTodoService";
import { GetTodoByIdService } from "./GetTodoByIdService";
import { GetTodosService } from "./GetTodosService";
import { UpdateTodoService } from "./UpdateTodoService";

/**
 * Comprehensive Todo Service
 * Combines all todo use cases into a single service class
 * Provides a unified interface for all todo-related business logic operations
 */
export class TodoService {
  private readonly createTodoUseCase: CreateTodoUseCase;
  private readonly getTodosUseCase: GetTodosUseCase;
  private readonly getTodoByIdUseCase: GetTodoByIdUseCase;
  private readonly updateTodoUseCase: UpdateTodoUseCase;
  private readonly deleteTodoUseCase: DeleteTodoUseCase;

  constructor(private readonly todoRepository: ITodoRepository) {
    this.createTodoUseCase = new CreateTodoService(this.todoRepository);
    this.getTodosUseCase = new GetTodosService(this.todoRepository);
    this.getTodoByIdUseCase = new GetTodoByIdService(this.todoRepository);
    this.updateTodoUseCase = new UpdateTodoService(this.todoRepository);
    this.deleteTodoUseCase = new DeleteTodoService(this.todoRepository);
  }

  /**
   * Create a new todo
   * @param todoData Data for creating a new todo
   * @returns Promise of created todo
   */
  public async createTodo(todoData: { title: string; description?: string | null }): Promise<Todo> {
    return createTodos(this.todoRepository, todoData);
  }

  /**
   * Get all todos with filtering and pagination
   * @param queryParams Query parameters for filtering and pagination
   * @returns Promise of paginated todos response
   */
  public async getTodos(queryParams: TodoQueryParams): Promise<PaginatedTodosResponse> {
    return getTodosWithQueryParams(this.todoRepository, queryParams);
  }

  /**
   * Get a single todo by its ID
   * @param id Todo ID
   * @returns Promise of todo or null if not found
   */
  public async getTodoById(id: string): Promise<Todo | null> {
    return getTodoById(this.todoRepository, id);
  }

  /**
   * Update an existing todo
   * @param id Todo ID
   * @param updates Updates to apply to the todo
   * @returns Promise of updated todo or null if not found
   */
  public async updateTodo(
    id: string,
    updates: { title?: string; description?: string | null; completed?: boolean }
  ): Promise<Todo | null> {
    return await this.updateTodoUseCase.execute(id, updates);
  }

  /**
   * Delete a todo by its ID
   * @param id Todo ID
   * @returns Promise of boolean indicating success
   */
  public async deleteTodo(id: string): Promise<boolean> {
    return await this.deleteTodoUseCase.execute(id);
  }
}
