import {
  Todo,
  CreateTodoRequest,
  UpdateTodoRequest,
} from "../interfaces/todo.interface";
import { pool } from "../config/database";
import { ErrorCode } from "../middleware/enums/error-code.enum";
import logger from "../config/logger";
import { v4 as uuidv4 } from "uuid";

export class TodoRepository {
  public async getAllTodos(): Promise<Todo[]> {
    try {
      const query = `
        SELECT id, title, description, completed, created_at, updated_at
        FROM todos
        ORDER BY created_at DESC
      `;

      const result = await pool.query(query);

      return result.rows.map(this.mapRowToTodo);
    } catch (error) {
      logger.error("Error fetching all todos", { error });
      const dbError = new Error("Failed to retrieve todos");
      (dbError as any).type = ErrorCode.DATABASE_ERROR;
      (dbError as any).originalError = error;
      throw dbError;
    }
  }

  private mapRowToTodo(row: any): Todo {
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      completed: row.completed,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }

  // Temporary: Keep other methods with in-memory implementation for now
  private readonly todos: Todo[] = [
    {
      id: "1",
      title: "Learn Node.js",
      description: "Study Node.js fundamentals",
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "2",
      title: "Build a REST API",
      description: "Use Express.js to create a robust API",
      completed: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "3",
      title: "Explore TypeScript",
      description: "Deep dive into TypeScript features and best practices",
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "4",
      title: "Set up CI/CD",
      description: "Implement continuous integration and deployment pipelines",
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  public getTodoById(id: string): Todo | undefined {
    return this.todos.find((todo) => todo.id === id);
  }

  public createTodo(data: CreateTodoRequest): Todo {
    const newTodo: Todo = {
      id: uuidv4(),
      title: data.title,
      description: data.description,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.todos.push(newTodo);
    return newTodo;
  }

  public updateTodo(id: string, data: UpdateTodoRequest): Todo | undefined {
    const todo = this.getTodoById(id);
    if (todo) {
      Object.assign(todo, {
        ...data,
        updatedAt: new Date(),
      });
    }
    return todo;
  }

  public deleteTodo(id: string): boolean {
    const index = this.todos.findIndex((todo) => todo.id === id);
    if (index !== -1) {
      this.todos.splice(index, 1);
      return true;
    }
    return false;
  }
}
