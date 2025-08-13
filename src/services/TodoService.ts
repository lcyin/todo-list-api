import { ITodoRepository, ITodoService } from "../domain/ports/TodoPorts";
import { Todo } from "../domain/Todo";
import { TodoQueryParams, PaginatedTodosResponse } from "../domain/TodoValueObjects";
import { createTodos } from "./components/create-todos.component";
import { deleteTodo } from "./components/delete-todo.component";
import { getTodoById } from "./components/get-todo-by-id.component";
import { getTodosWithQueryParams } from "./components/get-todos.component";
import { updateTodos } from "./components/update-todos.component";

/**
 * Comprehensive Todo Service
 * Combines all todo use cases into a single service class
 * Provides a unified interface for all todo-related business logic operations
 */
export class TodoService implements ITodoService {
  constructor(private readonly todoRepository: ITodoRepository) {}

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
    return updateTodos(this.todoRepository, id, updates);
  }

  /**
   * Delete a todo by its ID
   * @param id Todo ID
   * @returns Promise of boolean indicating success
   */
  public async deleteTodo(id: string): Promise<boolean> {
    return deleteTodo(this.todoRepository, id);
  }
}
