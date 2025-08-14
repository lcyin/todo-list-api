import { Pool } from "pg";
import { ITodoRepository } from "../../domain/ports/TodoPorts";
import { Todo } from "../../domain/Todo";
import { TodoFilters } from "../../domain/TodoValueObjects";
import { db } from "../../db";

/**
 * PostgreSQL implementation of TodoRepository
 * This is a secondary adapter that implements the outbound port
 */
export class TodoRepository implements ITodoRepository {
  private pool: Pool;

  constructor() {
    this.pool = db;

    // Note: Connection testing is handled when first operation is performed
  }

  /**
   * Save a new todo
   */
  async save(todo: Todo): Promise<Todo> {
    const client = await this.pool.connect();
    try {
      const query = `
        INSERT INTO todos (title, description, completed)
        VALUES ($1, $2, $3)
        RETURNING id, title, description, completed, created_at, updated_at
      `;
      const values = [todo.title, todo.description, todo.completed];
      const { rows } = await client.query(query, values);

      const [row] = rows;
      return this.castRawDataToTodo(row);
    } finally {
      client.release();
    }
  }

  castRawDataToTodo(row: any): Todo {
    const { id, title, description, completed } = row;
    return new Todo(id.toString(), title, description, completed);
  }

  /**
   * Find a todo by ID
   */
  async findById(id: string): Promise<Todo | null> {
    const client = await this.pool.connect();
    try {
      const query = "SELECT id, title, description, completed FROM todos WHERE id = $1";
      const { rows } = await client.query(query, [parseInt(id)]);

      if (rows.length === 0) {
        return null;
      }

      const [row] = rows;
      return this.castRawDataToTodo(row);
    } finally {
      client.release();
    }
  }

  /**
   * Find all todos with optional filters
   */
  async findAll(filters: TodoFilters): Promise<{ todos: Todo[]; total: number }> {
    const client = await this.pool.connect();
    try {
      const query = "SELECT id, title, description, completed FROM todos";

      // Build query conditions dynamically based on filters

      const { conditions, values } = applySearchFilters(filters);
      const { limit, offset } = filters;
      const queryWithConditions = buildQueryWithConditions(
        query,
        limit,
        offset,
        conditions,
        values
      );

      const { rows } = await client.query(queryWithConditions, values);

      const todos = rows.map(this.castRawDataToTodo);

      // Get total count for pagination
      const total = await this.count(filters);

      return { todos, total };
    } finally {
      client.release();
    }
  }

  /**
   * Update an existing todo
   */
  async update(todo: Todo): Promise<Todo> {
    const client = await this.pool.connect();
    try {
      const query = `
        UPDATE todos 
        SET title = $2, description = $3, completed = $4, updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
        RETURNING id, title, description, completed
      `;

      const values = [parseInt(todo.id), todo.title, todo.description, todo.completed];
      const { rows } = await client.query(query, values);

      if (rows.length === 0) {
        throw new Error(`Todo with id ${todo.id} not found`);
      }

      const [row] = rows;
      return this.castRawDataToTodo(row);
    } finally {
      client.release();
    }
  }

  /**
   * Delete a todo by ID
   */
  async delete(id: string): Promise<boolean> {
    const client = await this.pool.connect();
    try {
      const query = "DELETE FROM todos WHERE id = $1";
      const { rowCount } = await client.query(query, [parseInt(id)]);
      return rowCount !== null && rowCount > 0;
    } finally {
      client.release();
    }
  }

  /**
   * Get total count of todos with optional filters
   */
  private async count(filters?: TodoFilters): Promise<number> {
    const client = await this.pool.connect();
    try {
      let query = "SELECT COUNT(*) as count FROM todos";
      const values: (string | number | boolean)[] = [];
      const conditions: string[] = [];

      // Apply filters (same logic as findAll)
      if (filters?.completed !== undefined) {
        conditions.push(`completed = $${values.length + 1}`);
        values.push(filters.completed);
      }

      if (filters?.search) {
        conditions.push(
          `(title ILIKE $${values.length + 1} OR description ILIKE $${values.length + 2})`
        );
        values.push(`%${filters.search}%`, `%${filters.search}%`);
      }

      if (conditions.length > 0) {
        query += " WHERE " + conditions.join(" AND ");
      }

      const { rows } = await client.query(query, values);
      const [result] = rows;
      return parseInt(result.count);
    } finally {
      client.release();
    }
  }

  /**
   * Close the database connection pool
   */
  async close(): Promise<void> {
    await this.pool.end();
  }
}

const applySearchFilters = (filters: TodoFilters) => {
  const values: (string | number | boolean)[] = [];
  const conditions: string[] = [];
  // Apply filters
  if (filters?.completed !== undefined) {
    conditions.push(`completed = $${values.length + 1}`);
    values.push(filters.completed);
  }

  if (filters?.search) {
    conditions.push(
      `(title ILIKE $${values.length + 1} OR description ILIKE $${values.length + 2})`
    );
    values.push(`%${filters.search}%`, `%${filters.search}%`);
  }

  return {
    conditions,
    values,
  };
};

const buildQueryWithConditions = (
  query: string,
  limit: number,
  offset: number,
  conditions: string[],
  values: (string | number | boolean)[]
) => {
  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  // Apply sorting
  query += " ORDER BY created_at DESC";

  // Apply pagination
  if (limit) {
    query += ` LIMIT $${values.length + 1}`;
    values.push(limit);
  }

  if (offset) {
    query += ` OFFSET $${values.length + 1}`;
    values.push(offset);
  }
  return query;
};
