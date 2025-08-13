import { ITodoRepository } from "../../domain/ports/TodoPorts";

export async function updateTodos(
  todoRepository: ITodoRepository,
  id: string,
  updates: { title?: string; description?: string | null; completed?: boolean }
) {
  // Validate ID
  if (!id || id.trim().length === 0) {
    throw new Error("Todo ID cannot be empty");
  }

  // Validate title if provided
  if (updates.title !== undefined) {
    if (!updates.title || updates.title.trim().length === 0) {
      throw new Error("Todo title cannot be empty");
    }

    if (updates.title.length > 200) {
      throw new Error("Todo title cannot exceed 200 characters");
    }
  }

  // Validate description if provided
  if (
    updates.description !== undefined &&
    updates.description &&
    updates.description.length > 1000
  ) {
    throw new Error("Todo description cannot exceed 1000 characters");
  }

  // Find existing todo
  const existingTodo = await todoRepository.findById(id);
  if (!existingTodo) {
    return null;
  }

  // Create updated todo using the domain entity's update method
  const updatedTodo = existingTodo.update({
    title: updates.title?.trim(),
    description: updates.description,
    completed: updates.completed,
  });

  // Save via repository
  return await todoRepository.update(updatedTodo);
}
