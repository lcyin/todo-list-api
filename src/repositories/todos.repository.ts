import { Todo, CreateTodoRequest } from "../interfaces/todos.interface";
import { pool } from "../config/database";
import { ErrorCode } from "../middleware/enums/error-code.enum";
import logger from "../config/logger";
import { mapDBErrorToAppError } from "../utils/throw-custom-error.helper";

export class TodoRepository {
  private mapRowToTodo(row: any): Todo {
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      completed: row.completed,
      userId: row.user_id,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }

  public async getAllTodos(userId: string): Promise<Todo[]> {
    try {
      const query = `
          SELECT id, title, description, completed, user_id, created_at, updated_at
          FROM todos
          WHERE user_id = $1
          ORDER BY created_at DESC
        `;

      const result = await pool.query(query, [userId]);

      return result.rows.map(this.mapRowToTodo);
    } catch (error) {
      logger.error("Error fetching todos", { error, userId });
      throw mapDBErrorToAppError(error);
    }
  }

  public async getTodoById(
    id: string,
    userId: string
  ): Promise<Todo | undefined> {
    try {
      const query = `
          SELECT id, title, description, completed, user_id, created_at, updated_at
          FROM todos
          WHERE id = $1 AND user_id = $2
        `;

      const result = await pool.query(query, [id, userId]);

      if (result.rows.length > 0) {
        return this.mapRowToTodo(result.rows[0]);
      }
      return undefined;
    } catch (error) {
      logger.error("Error fetching todo by ID", { error, id, userId });
      throw mapDBErrorToAppError(error);
    }
  }

  public async createTodo(
    data: CreateTodoRequest,
    userId: string
  ): Promise<Todo> {
    try {
      const query = `
        INSERT INTO todos (title, description, user_id)
        VALUES ($1, $2, $3)
        RETURNING id, title, description, completed, user_id, created_at, updated_at
      `;
      const values = [data.title, data.description, userId];

      const result = await pool.query(query, values);
      return this.mapRowToTodo(result.rows[0]);
    } catch (error) {
      logger.error("Error creating new todo", { error, userId });
      throw mapDBErrorToAppError(error);
    }
  }

  public async updateTodo(
    id: string,
    data: {
      title: string;
      description?: string;
      completed: boolean;
    },
    userId: string
  ): Promise<Todo | null> {
    try {
      const updateQuery = `
        UPDATE todos
        SET title = $1, description = $2, completed = $3
        WHERE id = $4 AND user_id = $5
        RETURNING id, title, description, completed, user_id, created_at, updated_at
      `;

      const updateResult = await pool.query(updateQuery, [
        data.title,
        data.description,
        data.completed,
        id,
        userId,
      ]);

      const rawUpdatedTodo = updateResult.rows[0];
      if (!rawUpdatedTodo) {
        return null;
      }
      return this.mapRowToTodo(rawUpdatedTodo);
    } catch (error) {
      logger.error("Error updating todo", { error, id, userId });
      const dbError = new Error("Failed to update todo");
      (dbError as any).type = ErrorCode.DATABASE_ERROR;
      (dbError as any).originalError = error;
      throw dbError;
    }
  }

  public async deleteTodo(id: string, userId: string): Promise<boolean> {
    try {
      const deleteQuery = `
        DELETE FROM todos
        WHERE id = $1 AND user_id = $2
      `;
      const result = await pool.query(deleteQuery, [id, userId]);
      return result.rowCount !== null && result.rowCount > 0;
    } catch (error) {
      logger.error("Error deleting todo", { error, id, userId });
      throw mapDBErrorToAppError(error);
    }
  }
}
