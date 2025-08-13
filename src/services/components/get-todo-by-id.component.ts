import { ITodoRepository } from "../../domain/ports/TodoPorts";

export async function getTodoById(todoRepository: ITodoRepository, id: string) {
  // Validate ID format (basic validation)
  if (!id || id.trim().length === 0) {
    throw new Error("Todo ID cannot be empty");
  }

  // Validate ID is number
  if (isNaN(Number(id))) {
    throw new Error("Todo ID must be a number");
  }
  // Fetch todo from repository
  return todoRepository.findById(id);
}
