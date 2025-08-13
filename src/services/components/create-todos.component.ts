import { ITodoRepository } from "../../domain/ports/TodoPorts";
import { Todo } from "../../domain/Todo";

export async function createTodos(
  todoRepository: ITodoRepository,
  todoData: { title: string; description?: string | null }
) {
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
  return todoRepository.save(newTodo);
}
