import { Todo } from "../Todo";
import { TodoFilters, PaginatedTodosResponse, TodoQueryParams } from "../TodoValueObjects";

/**
 * Inbound port - defines what the domain can do
 * Use case interface for getting todos
 */
export interface GetTodosUseCase {
  /**
   * Execute the get todos use case
   * @param queryParams Query parameters for filtering and pagination
   * @returns Promise of paginated todos response
   */
  execute(queryParams: TodoQueryParams): Promise<PaginatedTodosResponse>;
}

/**
 * Inbound port - defines what the domain can do
 * Use case interface for getting a single todo by ID
 */
export interface GetTodoByIdUseCase {
  /**
   * Execute the get todo by ID use case
   * @param id Todo ID
   * @returns Promise of todo or null if not found
   */
  execute(id: string): Promise<Todo | null>;
}

/**
 * Inbound port - defines what the domain can do
 * Use case interface for creating a new todo
 */
export interface CreateTodoUseCase {
  /**
   * Execute the create todo use case
   * @param todoData Data for creating a new todo
   * @returns Promise of created todo
   */
  execute(todoData: { title: string; description?: string | null }): Promise<Todo>;
}

/**
 * Inbound port - defines what the domain can do
 * Use case interface for updating an existing todo
 */
export interface UpdateTodoUseCase {
  /**
   * Execute the update todo use case
   * @param id Todo ID
   * @param updates Updates to apply to the todo
   * @returns Promise of updated todo or null if not found
   */
  execute(
    id: string,
    updates: { title?: string; description?: string | null; completed?: boolean }
  ): Promise<Todo | null>;
}

/**
 * Inbound port - defines what the domain can do
 * Use case interface for deleting a todo
 */
export interface DeleteTodoUseCase {
  /**
   * Execute the delete todo use case
   * @param id Todo ID
   * @returns Promise of boolean indicating success
   */
  execute(id: string): Promise<boolean>;
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
   * Test the repository connection (if applicable)
   * @returns Promise that resolves when connection is verified
   */
  testConnection?(): Promise<void>;

  /**
   * Close the repository connection (if applicable)
   * @returns Promise that resolves when connection is closed
   */
  close?(): Promise<void>;
}
