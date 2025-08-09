import { Todo } from "./Todo";

/**
 * Query parameters for filtering and paginating todos
 */
export class TodoQueryParams {
  public readonly page: number;
  public readonly limit: number;
  public readonly completed?: boolean;
  public readonly search?: string;

  constructor(queryParams: {
    page?: string | number;
    limit?: string | number;
    completed?: string | boolean;
    search?: string;
  }) {
    // Parse and validate page
    this.page = this.parsePositiveInteger(queryParams.page, 1);

    // Parse and validate limit (max 100 items per page)
    this.limit = Math.min(this.parsePositiveInteger(queryParams.limit, 10), 100);

    // Parse completed filter
    if (queryParams.completed !== undefined) {
      this.completed = this.parseBoolean(queryParams.completed);
    }

    // Parse search query
    if (queryParams.search && typeof queryParams.search === "string") {
      this.search = queryParams.search.trim();
      if (this.search.length === 0) {
        this.search = undefined;
      }
    }
  }

  private parsePositiveInteger(value: string | number | undefined, defaultValue: number): number {
    if (value === undefined) return defaultValue;

    const parsed = typeof value === "string" ? parseInt(value, 10) : value;
    return isNaN(parsed) || parsed < 1 ? defaultValue : parsed;
  }

  private parseBoolean(value: string | boolean | undefined): boolean | undefined {
    if (typeof value === "boolean") return value;
    if (typeof value === "string") {
      const lower = value.toLowerCase();
      if (lower === "true" || lower === "1") return true;
      if (lower === "false" || lower === "0") return false;
    }
    return undefined;
  }

  /**
   * Get the offset for database queries
   */
  public get offset(): number {
    return (this.page - 1) * this.limit;
  }
}

/**
 * Filters for repository queries
 */
export class TodoFilters {
  constructor(
    public readonly completed?: boolean,
    public readonly search?: string,
    public readonly limit: number = 10,
    public readonly offset: number = 0
  ) {}

  public static fromQueryParams(params: TodoQueryParams): TodoFilters {
    return new TodoFilters(params.completed, params.search, params.limit, params.offset);
  }
}

/**
 * Paginated response for todos
 */
export class PaginatedTodosResponse {
  constructor(
    public readonly todos: Todo[],
    public readonly pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrevious: boolean;
    }
  ) {}

  public static create(
    todos: Todo[],
    total: number,
    page: number,
    limit: number
  ): PaginatedTodosResponse {
    const totalPages = Math.ceil(total / limit);

    return new PaginatedTodosResponse(todos, {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrevious: page > 1,
    });
  }

  /**
   * Converts the response to a plain object for serialization
   */
  public toPlainObject(): {
    todos: ReturnType<Todo["toPlainObject"]>[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrevious: boolean;
    };
  } {
    return {
      todos: this.todos.map(todo => todo.toPlainObject()),
      pagination: this.pagination,
    };
  }
}
