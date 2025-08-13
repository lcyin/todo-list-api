import { CreateTodoUseCase, ITodoRepository } from "../domain/ports/TodoPorts";
import { Todo } from "../domain/Todo";

/**
 * Use case service for creating a new todo
 * This implements the business logic for todo creation
 */
export class CreateTodoService implements CreateTodoUseCase {
  constructor(private readonly todoRepository: ITodoRepository) {}

  /**
   * Execute the create todo use case
   * @param todoData Data for creating a new todo
   * @returns Promise of created todo
   */
  public async execute(todoData: { title: string; description?: string | null }): Promise<Todo> {
    // Validate input
    if (!todoData.title || todoData.title.trim().length === 0) {
      throw new Error("Todo title cannot be empty");
    }

    if (todoData.title.length > 200) {
      throw new Error("Todo title cannot exceed 200 characters");
    }

    if (todoData.description && todoData.description.length > 1000) {
      throw new Error("Todo description cannot exceed 1000 characters");
    }

    // Create new todo entity
    const newTodo = new Todo(
      "", // ID will be assigned by the repository
      todoData.title.trim(),
      todoData.description || null,
      false, // New todos are incomplete by default
      new Date(),
      new Date()
    );

    // Save via repository
    return await this.todoRepository.save(newTodo);
  }
}
