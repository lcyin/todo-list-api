import { ITodoRepository } from "../../domain/ports/TodoPorts";
import {
  PaginatedTodosResponse,
  TodoFilters,
  TodoQueryParams,
} from "../../domain/TodoValueObjects";

export async function getTodosWithQueryParams(
  todoRepository: ITodoRepository,
  queryParams: TodoQueryParams
) {
  // Convert query parameters to repository filters
  const filters = TodoFilters.fromQueryParams(queryParams);

  // Fetch todos from repository
  const { todos, total } = await todoRepository.findAll(filters);

  // Create and return paginated response
  return PaginatedTodosResponse.create(todos, total, queryParams.page, queryParams.limit);
}
