import {
  Todo,
  CreateTodoRequest,
  UpdateTodoRequest,
} from "../interfaces/todo.interface";
import { pool } from "../config/database";
import { ErrorCode } from "../middleware/enums/error-code.enum";
import logger from "../config/logger";
import { v4 as uuidv4 } from "uuid";
import { QueryResult } from "pg";

export class TodoRepository {
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

  public async getTodoById(id: string): Promise<Todo | undefined> {
    try {
      const query = `
      SELECT id, title, description, completed, created_at, updated_at
      FROM todos
      WHERE id = $1;
      `;
      const result = await pool.query(query, [id]);
      if (result.rows.length > 0) {
        return this.mapRowToTodo(result.rows[0]);
      }
      return undefined;
    } catch (error) {
      logger.error("Error fetching todo by ID", { error });
      const dbError = new Error("Failed to retrieve todo");
      (dbError as any).type = ErrorCode.DATABASE_ERROR;
      (dbError as any).originalError = error;
      throw dbError;
    }
  }

  public async createTodo(data: CreateTodoRequest): Promise<Todo> {
    try {
      const query = `
        INSERT INTO todos (title, description)
        VALUES ($1, $2)
        RETURNING id, title, description, completed, created_at, updated_at
      `;
      const newTodo: Pick<Todo, "title" | "description"> = {
        title: data.title,
        description: data.description,
      };
      const values = [newTodo.title, newTodo.description];

      const result = await pool.query(query, values);
      return this.mapRowToTodo(result.rows[0]);
    } catch (error) {
      logger.error("Error creating new todo", { error });
      const dbError = new Error("Failed to create todo");
      (dbError as any).type = ErrorCode.DATABASE_ERROR;
      (dbError as any).originalError = error;
      throw dbError;
    }
  }

  public async updateTodo(
    id: string,
    data: {
      title: string;
      description: string;
      completed: boolean;
    }
  ): Promise<Todo> {
    try {
      const updateQuery = `
        UPDATE todos
        SET title = $1,
            description = $2,
            completed = $3
        WHERE id = $4
        RETURNING id, title, description, completed, created_at, updated_at;
      `;
      const values = [data.title, data.description, data.completed, id];
      const updateResult = await pool.query(updateQuery, values);
      return this.mapRowToTodo(updateResult.rows[0]);
    } catch (error) {
      logger.error("Error updating todo", { error });
      const dbError = new Error("Failed to update todo");
      (dbError as any).type = ErrorCode.DATABASE_ERROR;
      (dbError as any).originalError = error;
      throw dbError;
    }
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
