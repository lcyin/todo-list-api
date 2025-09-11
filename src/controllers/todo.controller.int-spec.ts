import app from "../app";
import request from "supertest";
import { pool } from "../config/database";
import { Pool } from "pg";
import { v4 as uuidv4 } from "uuid";

describe("TodoController API Response Shape Tests", () => {
  const appInstance = app;

  beforeEach(() => {
    // Reset any state if necessary before each test
    // For example, clear the postgres database
    const query = `DELETE FROM todos;`;
    return pool.query(query);
  });

  describe("GET /api/todos", () => {
    it("should return correct response shape for getAllTodos", async () => {
      await setupTodos(pool);
      const { body, status } = await request(appInstance).get("/api/todos");

      expect({
        body,
        status,
      }).toEqual({
        body: {
          data: [
            {
              completed: false,
              createdAt: expect.any(String),
              description: "Study Node.js fundamentals",
              id: expect.any(String),
              title: "Learn Node.js",
              updatedAt: expect.any(String),
            },
            {
              completed: true,
              createdAt: expect.any(String),
              description: "Use Express.js to create a robust API",
              id: expect.any(String),
              title: "Build a REST API",
              updatedAt: expect.any(String),
            },
            {
              completed: false,
              createdAt: expect.any(String),
              description:
                "Deep dive into TypeScript features and best practices",
              id: expect.any(String),
              title: "Explore TypeScript",
              updatedAt: expect.any(String),
            },
            {
              completed: false,
              createdAt: expect.any(String),
              description:
                "Implement continuous integration and deployment pipelines",
              id: expect.any(String),
              title: "Set up CI/CD",
              updatedAt: expect.any(String),
            },
          ],
          message: "Todos retrieved successfully",
          success: true,
        },
        status: 200,
      });
    });
  });

  describe("GET /api/todos/:id", () => {
    it("should return correct response shape for getTodoById", async () => {
      const {
        rows: [todo1],
      } = await setupTodos(pool);

      const { body, status } = await request(appInstance).get(
        "/api/todos/:id".replace(":id", todo1.id)
      );

      expect({
        body,
        status,
      }).toEqual({
        body: {
          data: {
            completed: false,
            createdAt: expect.any(String),
            description: "Study Node.js fundamentals",
            id: todo1.id,
            title: "Learn Node.js",
            updatedAt: expect.any(String),
          },
          message: "Todo retrieved successfully",
          success: true,
        },
        status: 200,
      });
    });
  });

  describe("POST /api/todos", () => {
    it("should return correct response shape for createTodo", async () => {
      const newTodo = {
        title: "New Todo",
        description: "This is a new todo item",
      };

      const { body, status } = await request(appInstance)
        .post("/api/todos")
        .send(newTodo);

      expect({
        body,
        status,
      }).toEqual({
        body: {
          data: {
            id: expect.any(String),
            title: newTodo.title,
            description: newTodo.description,
            completed: false,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          },
          message: "Todo created successfully",
          success: true,
        },
        status: 201,
      });
    });
  });

  describe("PUT /api/todos/:id", () => {
    it("should return correct response shape for updateTodo", async () => {
     const {
        rows: [todo1],
      } = await setupTodos(pool);
      const updates = {
        title: "Updated Todo",
        description: "This todo has been updated",
        completed: true,
      };

      const response = await request(appInstance)
        .put("/api/todos/:id".replace(":id", todo1.id))
        .send(updates);

      expect(response.body).toEqual({
        data: {
          id: todo1.id,
          title: updates.title,
          description: updates.description,
          completed: updates.completed,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
        message: "Todo updated successfully",
        success: true,
      });
    });
  });

  describe("DELETE /api/todos/:id", () => {
    it("should return correct response shape for deleteTodo", async () => {
      const {
        rows: [todo1],
      } = await setupTodos(pool);
      const response = await request(appInstance)
        .delete("/api/todos/:id".replace(":id", todo1.id))
        .expect(200);

      expect(response.body).toEqual({
        data: [],
        message: "Todo deleted successfully",
        success: true,
      });
    });
  });
});

async function setupTodos(pool: Pool): Promise<{
  rows: Array<{
    id: string;
    title: string;
    description: string;
    completed: boolean;
    created_at: Date;
    updated_at: Date;
  }>;
}> {
  const todos = [
    {
      id: uuidv4(),
      title: "Learn Node.js",
      description: "Study Node.js fundamentals",
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: uuidv4(),
      title: "Build a REST API",
      description: "Use Express.js to create a robust API",
      completed: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: uuidv4(),
      title: "Explore TypeScript",
      description: "Deep dive into TypeScript features and best practices",
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: uuidv4(),
      title: "Set up CI/CD",
      description: "Implement continuous integration and deployment pipelines",
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
  const values = todos
    .map(
      (todo) =>
        `('${todo.id}', '${todo.title}', '${todo.description}', ${todo.completed}, NOW(), NOW())`
    )
    .join(", ");
  const query = `
    INSERT INTO todos (id, title, description, completed, created_at, updated_at)
    VALUES 
      ${values}
    RETURNING id, title, description, completed, created_at, updated_at;
  `;
  return pool.query(query);
}
