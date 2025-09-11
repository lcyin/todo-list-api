import { Todo, CreateTodoRequest } from "../interfaces/todo.interface";
import { pool } from "../config/database";
import { ErrorCode } from "../middleware/enums/error-code.enum";
import logger from "../config/logger";

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
      throw mapDBErrorToAppError(error);
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
      throw mapDBErrorToAppError(error);
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
      throw mapDBErrorToAppError(error);
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

  public async deleteTodo(id: string): Promise<boolean> {
    try {
      const deleteQuery = `
        DELETE FROM todos
        WHERE id = $1;
      `;
      pool.query(deleteQuery, [id]);
      return true;
    } catch (error) {
      logger.error("Error deleting todo", { error });
      throw mapDBErrorToAppError(error);
    }
  }
}

function mapDBErrorToAppError(error: any): Error {
  const appError = new Error("Database operation failed");
  (appError as any).type = ErrorCode.DATABASE_ERROR;
  (appError as any).originalError = error;
  return appError;
}
