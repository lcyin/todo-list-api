import { TodoRepository } from "../domain/ports/TodoPorts";
import { InMemoryTodoRepository } from "./secondary/InMemoryTodoRepository";
import { PostgresTodoRepository } from "./secondary/PostgresTodoRepository";

/**
 * Repository factory for creating todo repositories
 * Supports switching between different repository implementations based on configuration
 */
export class TodoRepositoryFactory {
  /**
   * Create a todo repository based on configuration
   * @returns TodoRepository instance
   */
  public static create(): TodoRepository {
    const repositoryType = process.env.REPOSITORY_TYPE || "memory";

    switch (repositoryType.toLowerCase()) {
      case "postgres":
      case "postgresql":
        console.log("🗄️  Using PostgreSQL repository");
        return new PostgresTodoRepository();

      case "memory":
      case "inmemory":
      default:
        console.log("🧠 Using in-memory repository");
        return new InMemoryTodoRepository();
    }
  }

  /**
   * Create a PostgreSQL repository specifically
   * @returns PostgresTodoRepository instance
   */
  public static createPostgres(): PostgresTodoRepository {
    return new PostgresTodoRepository();
  }

  /**
   * Create an in-memory repository specifically
   * @returns InMemoryTodoRepository instance
   */
  public static createInMemory(): InMemoryTodoRepository {
    return new InMemoryTodoRepository();
  }
}
