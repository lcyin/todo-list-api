import { GetTodosUseCase, TodoRepository } from "../domain/ports/TodoPorts";
import { TodoQueryParams, PaginatedTodosResponse, TodoFilters } from "../domain/TodoValueObjects";

/**
 * Get Todos Use Case Implementation
 * Implements the business logic for retrieving todos with filtering and pagination
 */
export class GetTodosService implements GetTodosUseCase {
  constructor(private readonly todoRepository: TodoRepository) {}

  /**
   * Execute the get todos use case
   * @param queryParams Query parameters for filtering and pagination
   * @returns Promise of paginated todos response
   */
  public async execute(queryParams: TodoQueryParams): Promise<PaginatedTodosResponse> {
    // Convert query parameters to repository filters
    const filters = TodoFilters.fromQueryParams(queryParams);

    // Fetch todos from repository
    const { todos, total } = await this.todoRepository.findAll(filters);

    // Create and return paginated response
    return PaginatedTodosResponse.create(todos, total, queryParams.page, queryParams.limit);
  }
}
