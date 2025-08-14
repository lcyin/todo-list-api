import { Todo } from "../Todo";
import { PaginatedTodosResponse, TodoFilters, TodoQueryParams } from "../TodoValueObjects";

/**
 * Inbound port - defines what the domain can do
 */
export interface ITodoService {
  createTodo(todoData: { title: string; description?: string | null }): Promise<Todo>;
  getTodos(queryParams: TodoQueryParams): Promise<PaginatedTodosResponse>;
  getTodoById(id: string): Promise<Todo | null>;
  updateTodo(
    id: string,
    updates: { title?: string; description?: string | null; completed?: boolean }
  ): Promise<Todo | null>;
  deleteTodo(id: string): Promise<boolean>;
}

/**
 * Outbound port - defines what the domain needs
 * Repository interface for todo data access
 */
export interface ITodoRepository {
  /**
   * Find all todos with optional filters and pagination
   * @param filters Filters and pagination parameters
   * @returns Promise of todos and total count
   */
  findAll(filters: TodoFilters): Promise<{ todos: Todo[]; total: number }>;

  /**
   * Find a todo by its ID
   * @param id Todo ID
   * @returns Promise of todo or null if not found
   */
  findById(id: string): Promise<Todo | null>;

  /**
   * Save a new todo
   * @param todo Todo to save
   * @returns Promise of saved todo
   */
  save(todo: Todo): Promise<Todo>;

  /**
   * Update an existing todo
   * @param todo Todo to update
   * @returns Promise of updated todo
   */
  update(todo: Todo): Promise<Todo>;

  /**
   * Delete a todo by its ID
   * @param id Todo ID
   * @returns Promise of boolean indicating success
   */
  delete(id: string): Promise<boolean>;

  /**
   * Close the repository connection (if applicable)
   * @returns Promise that resolves when connection is closed
   */
  close?(): Promise<void>;
}
