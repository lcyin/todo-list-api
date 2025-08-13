import { DeleteTodoUseCase, ITodoRepository } from "../domain/ports/TodoPorts";

/**
 * Use case service for deleting a todo
 * This implements the business logic for todo deletion
 */
export class DeleteTodoService implements DeleteTodoUseCase {
  constructor(private readonly todoRepository: ITodoRepository) {}

  /**
   * Execute the delete todo use case
   * @param id Todo ID
   * @returns Promise of boolean indicating success
   */
  public async execute(id: string): Promise<boolean> {
    // Validate ID
    if (!id || id.trim().length === 0) {
      throw new Error("Todo ID cannot be empty");
    }

    // Check if todo exists before attempting to delete
    const existingTodo = await this.todoRepository.findById(id);
    if (!existingTodo) {
      return false;
    }

    // Delete via repository
    return await this.todoRepository.delete(id);
  }
}
