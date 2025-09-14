import app from "../app";
import request from "supertest";
import { pool } from "../config/database";
import { Pool } from "pg";
import { v4 as uuidv4 } from "uuid";
jest.mock("../middleware/auth.middleware", () => {
  return {
    authenticateToken: (
      req: any,
      res: any,
      next: (err?: any) => void
    ): void => {
      // Mock authentication by attaching a user object to the request
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new Error("No token provided");
      }
      const userId = authHeader.substring(7);
      req.user = {
        id: userId,
      };
      next();
    },
  };
});
describe("TodoController API Response Shape Tests", () => {
  const appInstance = app;

  beforeEach(() => {
    // Reset any state if necessary before each test
    // For example, clear the postgres database
    const query = `DELETE FROM todos;`;
    return pool.query(query);
  });

  describe("GET /todos", () => {
    it("should return correct response shape for getAllTodos", async () => {
      const { user } = await setupTodos(pool);
      const { body, status } = await request(appInstance)
        .get("/todos")
        .set({
          Authorization: `Bearer ${user.id}`,
        });

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
              userId: user.id,
            },
            {
              completed: true,
              createdAt: expect.any(String),
              description: "Use Express.js to create a robust API",
              id: expect.any(String),
              title: "Build a REST API",
              updatedAt: expect.any(String),
              userId: user.id,
            },
            {
              completed: false,
              createdAt: expect.any(String),
              description:
                "Deep dive into TypeScript features and best practices",
              id: expect.any(String),
              title: "Explore TypeScript",
              updatedAt: expect.any(String),
              userId: user.id,
            },
            {
              completed: false,
              createdAt: expect.any(String),
              description:
                "Implement continuous integration and deployment pipelines",
              id: expect.any(String),
              title: "Set up CI/CD",
              updatedAt: expect.any(String),
              userId: user.id,
            },
          ],
          message: "Todos retrieved successfully",
          success: true,
        },
        status: 200,
      });
    });
  });

  describe("GET /todos/:id", () => {
    it("should return correct response shape for getTodoById", async () => {
      const {
        todos: [todo1],
        user,
      } = await setupTodos(pool);
      const path = "/todos/:id".replace(":id", todo1.id);
      const { body, status } = await request(appInstance)
        .get(path)
        .set({
          Authorization: `Bearer ${user.id}`,
        });

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
            userId: user.id,
          },
          message: "Todo retrieved successfully",
          success: true,
        },
        status: 200,
      });
    });
  });

  describe("POST /todos", () => {
    it("should return correct response shape for createTodo", async () => {
      const user = await setupUser(
        `test-${uuidv4()}@example.com`,
        "Password@123",
        "John",
        "Doe"
      );
      // New todo data
      const newTodo = {
        title: "New Todo",
        description: "This is a new todo item",
      };

      const { body, status } = await request(appInstance)
        .post("/todos")
        .set({
          Authorization: `Bearer ${user.id}`,
        })
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
            userId: user.id,
          },
          message: "Todo created successfully",
          success: true,
        },
        status: 201,
      });
    });
  });

  describe("PUT /todos/:id", () => {
    it("should return correct response shape for updateTodo", async () => {
      const {
        todos: [todo1],
        user,
      } = await setupTodos(pool);
      const updates = {
        title: "Updated Todo",
        description: "This todo has been updated",
        completed: true,
      };
      const path = "/todos/:id".replace(":id", todo1.id);
      const response = await request(appInstance)
        .put(path)
        .set({
          Authorization: `Bearer ${user.id}`,
        })
        .send(updates);

      expect(response.body).toEqual({
        data: {
          id: todo1.id,
          title: updates.title,
          description: updates.description,
          completed: updates.completed,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          userId: user.id,
        },
        message: "Todo updated successfully",
        success: true,
      });
    });
  });

  describe("DELETE /todos/:id", () => {
    it("should return correct response shape for deleteTodo", async () => {
      const {
        todos: [todo1],
        user,
      } = await setupTodos(pool);
      const path = "/todos/:id".replace(":id", todo1.id);
      const response = await request(appInstance)
        .delete(path)
        .set({
          Authorization: `Bearer ${user.id}`,
        })
        .expect(200);

      expect(response.body).toEqual({
        data: [],
        message: "Todo deleted successfully",
        success: true,
      });
    });
  });
});

async function setupTodos(pool: Pool) {
  const todosData = [
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
  const user = await setupUser(
    `test-${uuidv4()}@example.com`,
    "Password@123",
    "John",
    "Doe"
  );
  const values = todosData
    .map(
      (todo) =>
        `('${todo.id}', '${todo.title}', '${todo.description}', ${todo.completed}, NOW(), NOW(), '${user.id}')`
    )
    .join(", ");
  const query = `
    INSERT INTO todos (id, title, description, completed, created_at, updated_at, user_id)
    VALUES 
      ${values}
    RETURNING id, title, description, completed, created_at as "createdAt", updated_at as "updatedAt";
  `;
  const result = await pool.query(query);
  const todos = result.rows;
  return { todos, user };
}

async function setupUser(
  email: string,
  password: string,
  firstName: string,
  lastName: string
): Promise<{
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
}> {
  const query = `
    INSERT INTO users (email, password, first_name, last_name)
    VALUES ($1, $2, $3, $4)
    RETURNING id, email, first_name AS "firstName", last_name AS "lastName", created_at AS "createdAt", updated_at AS "updatedAt"
  `;
  const values = [email, password, firstName, lastName];
  const result = await pool.query(query, values);
  const user = result.rows[0];
  return user;
}
