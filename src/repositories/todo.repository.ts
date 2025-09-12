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
      userId: row.user_id,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }

  public async getAllTodos(userId?: string): Promise<Todo[]> {
    try {
      let query: string;
      let params: any[] = [];

      if (userId) {
        query = `
          SELECT id, title, description, completed, user_id, created_at, updated_at
          FROM todos
          WHERE user_id = $1
          ORDER BY created_at DESC
        `;
        params = [userId];
      } else {
        // For admin or system use - get all todos regardless of user
        query = `
          SELECT id, title, description, completed, user_id, created_at, updated_at
          FROM todos
          ORDER BY created_at DESC
        `;
      }

      const result = await pool.query(query, params);

      return result.rows.map(this.mapRowToTodo);
    } catch (error) {
      logger.error("Error fetching todos", { error, userId });
      throw mapDBErrorToAppError(error);
    }
  }

  public async getTodoById(id: string, userId?: string): Promise<Todo | undefined> {
    try {
      let query: string;
      let params: any[];

      if (userId) {
        query = `
          SELECT id, title, description, completed, user_id, created_at, updated_at
          FROM todos
          WHERE id = $1 AND user_id = $2
        `;
        params = [id, userId];
      } else {
        // For admin or system use
        query = `
          SELECT id, title, description, completed, user_id, created_at, updated_at
          FROM todos
          WHERE id = $1
        `;
        params = [id];
      }

      const result = await pool.query(query, params);
      
      if (result.rows.length > 0) {
        return this.mapRowToTodo(result.rows[0]);
      }
      return undefined;
    } catch (error) {
      logger.error("Error fetching todo by ID", { error, id, userId });
      throw mapDBErrorToAppError(error);
    }
  }

  public async createTodo(data: CreateTodoRequest, userId: string): Promise<Todo> {
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
      title?: string;
      description?: string;
      completed?: boolean;
    },
    userId: string
  ): Promise<Todo | null> {
    try {
      // First check if todo exists and belongs to user
      const existingTodo = await this.getTodoById(id, userId);
      if (!existingTodo) {
        return null;
      }

      // Build dynamic update query
      const updateFields: string[] = [];
      const values: any[] = [];
      let parameterIndex = 1;

      if (data.title !== undefined) {
        updateFields.push(`title = $${parameterIndex++}`);
        values.push(data.title);
      }

      if (data.description !== undefined) {
        updateFields.push(`description = $${parameterIndex++}`);
        values.push(data.description);
      }

      if (data.completed !== undefined) {
        updateFields.push(`completed = $${parameterIndex++}`);
        values.push(data.completed);
      }

      if (updateFields.length === 0) {
        return existingTodo; // No updates needed
      }

      // Add WHERE clause parameters
      values.push(id, userId);

      const updateQuery = `
        UPDATE todos
        SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
        WHERE id = $${parameterIndex++} AND user_id = $${parameterIndex}
        RETURNING id, title, description, completed, user_id, created_at, updated_at
      `;

      const updateResult = await pool.query(updateQuery, values);
      
      if (updateResult.rows.length === 0) {
        return null;
      }

      return this.mapRowToTodo(updateResult.rows[0]);
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

function mapDBErrorToAppError(error: any): Error {
  const appError = new Error("Database operation failed");
  (appError as any).type = ErrorCode.DATABASE_ERROR;
  (appError as any).originalError = error;
  return appError;
}
