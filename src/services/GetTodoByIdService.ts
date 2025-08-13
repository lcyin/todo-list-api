import { GetTodoByIdUseCase, ITodoRepository } from "../domain/ports/TodoPorts";
import { Todo } from "../domain/Todo";

/**
 * Get Todo By ID Use Case Implementation
 * Implements the business logic for retrieving a single todo by its ID
 */
export class GetTodoByIdService implements GetTodoByIdUseCase {
  constructor(private readonly todoRepository: ITodoRepository) {}

  /**
   * Execute the get todo by ID use case
   * @param id Todo ID
   * @returns Promise of todo or null if not found
   */
  public async execute(id: string): Promise<Todo | null> {
    // Validate ID format (basic validation)
    if (!id || id.trim().length === 0) {
      throw new Error("Todo ID cannot be empty");
    }

    // Validate ID is number
    if (isNaN(Number(id))) {
      throw new Error("Todo ID must be a number");
    }

    // Fetch todo from repository
    return await this.todoRepository.findById(id);
  }
}
