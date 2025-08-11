import { TodoRepository } from "../../domain/ports/TodoPorts";
import { Todo } from "../../domain/Todo";
import { TodoFilters } from "../../domain/TodoValueObjects";

/**
 * In-memory implementation of TodoRepository
 * This is a secondary adapter that implements the outbound port
 */
export class InMemoryTodoRepository implements TodoRepository {
  private todos: Map<string, Todo> = new Map();
  private nextId = 1;

  constructor() {
    // Initialize with some sample data
    this.seedData();
  }

  /**
   * Seed the repository with sample todos
   */
  private seedData(): void {
    const sampleTodos = [
      new Todo("1", "Learn TypeScript", "Study TypeScript fundamentals", false),
      new Todo("2", "Build REST API", "Create a todo list API with Express", false),
      new Todo("3", "Write tests", "Add comprehensive test coverage", false),
      new Todo("4", "Deploy application", "Deploy to production environment", true),
      new Todo("5", "Update documentation", "Keep README and docs up to date", true),
    ];

    sampleTodos.forEach(todo => {
      this.todos.set(todo.id, todo);
      this.nextId = Math.max(this.nextId, parseInt(todo.id) + 1);
    });
  }

  /**
   * Find all todos with optional filters and pagination
   */
  public async findAll(filters: TodoFilters): Promise<{ todos: Todo[]; total: number }> {
    let filteredTodos = Array.from(this.todos.values());

    // Apply completed filter
    if (filters.completed !== undefined) {
      filteredTodos = filteredTodos.filter(todo => todo.completed === filters.completed);
    }

    // Apply search filter (search in title and description)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredTodos = filteredTodos.filter(
        todo =>
          todo.title.toLowerCase().includes(searchLower) ||
          (todo.description && todo.description.toLowerCase().includes(searchLower))
      );
    }

    // Sort by creation date (newest first)
    filteredTodos.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const total = filteredTodos.length;

    // Apply pagination
    const paginatedTodos = filteredTodos.slice(filters.offset, filters.offset + filters.limit);

    return { todos: paginatedTodos, total };
  }

  /**
   * Find a todo by its ID
   */
  public async findById(id: string): Promise<Todo | null> {
    return this.todos.get(id) || null;
  }

  /**
   * Save a new todo
   */
  public async save(todo: Todo): Promise<Todo> {
    const newId = this.nextId.toString();
    this.nextId++;

    const newTodo = new Todo(
      newId,
      todo.title,
      todo.description,
      todo.completed,
      todo.createdAt,
      todo.updatedAt
    );

    this.todos.set(newId, newTodo);
    return newTodo;
  }

  /**
   * Update an existing todo
   */
  public async update(todo: Todo): Promise<Todo> {
    if (!this.todos.has(todo.id)) {
      throw new Error(`Todo with id ${todo.id} not found`);
    }

    this.todos.set(todo.id, todo);
    return todo;
  }

  /**
   * Delete a todo by its ID
   */
  public async delete(id: string): Promise<boolean> {
    return this.todos.delete(id);
  }

  /**
   * Test connection (no-op for in-memory repository)
   */
  public async testConnection(): Promise<void> {
    // No connection to test for in-memory repository
    return Promise.resolve();
  }

  /**
   * Close connection (no-op for in-memory repository)
   */
  public async close(): Promise<void> {
    // No connection to close for in-memory repository
    return Promise.resolve();
  }

  /**
   * Get the total count of todos (for testing purposes)
   */
  public async count(): Promise<number> {
    return this.todos.size;
  }

  /**
   * Clear all todos (for testing purposes)
   */
  public async clear(): Promise<void> {
    this.todos.clear();
    this.nextId = 1;
  }
}
