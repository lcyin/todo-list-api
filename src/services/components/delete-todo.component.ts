import { ITodoRepository } from "../../domain/ports/TodoPorts";

export async function deleteTodo(todoRepository: ITodoRepository, id: string) {
  // Validate ID
  if (!id || id.trim().length === 0) {
    throw new Error("Todo ID cannot be empty");
  }

  // Check if todo exists before attempting to delete
  const existingTodo = await todoRepository.findById(id);
  if (!existingTodo) {
    return false;
  }

  // Delete via repository
  return todoRepository.delete(id);
}
