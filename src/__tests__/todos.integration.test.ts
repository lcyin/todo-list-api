import request from "supertest";
import app from "../app";
import { Pool } from "pg";
import { db } from "../db";
import { Todo } from "../domain/Todo";

describe("@todos.integration.test.ts", () => {
  beforeEach(async () => {
    await cleanupTodos(db);
  });

  describe("GET /api/v1/todos", () => {
    describe("Basic functionality", () => {
      it("should return 200 and a list of todos", async () => {
        await setupTodos(db);
        const { body } = await request(app).get("/api/v1/todos").expect(200);

        expect(body).toEqual({
          todos: [
            {
              id: expect.any(String),
              title: "Test Todo 2",
              description: "Description for test todo 2",
              completed: true,
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
            },
            {
              id: expect.any(String),
              title: "Test Todo 1",
              description: "Description for test todo 1",
              completed: false,
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
            },
          ],
          pagination: {
            page: expect.any(Number),
            limit: expect.any(Number),
            total: expect.any(Number),
            totalPages: expect.any(Number),
            hasNext: expect.any(Boolean),
            hasPrevious: expect.any(Boolean),
          },
        });
      });

      it("should return todos with correct structure and pagination", async () => {
        await setupTodos(db);

        const { body } = await request(app).get("/api/v1/todos").expect(200);

        expect(body).toEqual({
          todos: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(String),
              title: expect.any(String),
              description: expect.any(String),
              completed: expect.any(Boolean),
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
            }),
          ]),
          pagination: {
            page: expect.any(Number),
            limit: expect.any(Number),
            total: expect.any(Number),
            totalPages: expect.any(Number),
            hasNext: expect.any(Boolean),
            hasPrevious: expect.any(Boolean),
          },
        });
      });
    });

    describe("Query parameters", () => {
      it("should handle page parameter and return correct pagination", async () => {
        await setupTodos(db);
        const { body } = await request(app).get("/api/v1/todos?page=1").expect(200);

        expect(body).toEqual({
          todos: expect.any(Array),
          pagination: expect.objectContaining({
            page: 1,
            limit: expect.any(Number),
            total: expect.any(Number),
            totalPages: expect.any(Number),
            hasNext: expect.any(Boolean),
            hasPrevious: expect.any(Boolean),
          }),
        });
      });

      it("should handle limit parameter and return limited todos", async () => {
        await setupTodos(db);
        const { body } = await request(app).get("/api/v1/todos?limit=2").expect(200);

        expect(body).toEqual({
          todos: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(String),
              title: expect.any(String),
              description: expect.any(String),
              completed: expect.any(Boolean),
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
            }),
          ]),
          pagination: expect.objectContaining({
            page: expect.any(Number),
            limit: 2,
            total: expect.any(Number),
            totalPages: expect.any(Number),
            hasNext: expect.any(Boolean),
            hasPrevious: expect.any(Boolean),
          }),
        });
      });

      it("should handle completed filter and return filtered todos", async () => {
        await setupTodos(db);
        const { body: bodyTrue } = await request(app)
          .get("/api/v1/todos?completed=true")
          .expect(200);

        expect(bodyTrue).toEqual({
          todos: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(String),
              title: expect.any(String),
              description: expect.any(String),
              completed: true,
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
            }),
          ]),
          pagination: expect.objectContaining({
            page: expect.any(Number),
            limit: expect.any(Number),
            total: expect.any(Number),
            totalPages: expect.any(Number),
            hasNext: expect.any(Boolean),
            hasPrevious: expect.any(Boolean),
          }),
        });

        const { body: bodyFalse } = await request(app)
          .get("/api/v1/todos?completed=false")
          .expect(200);

        expect(bodyFalse).toEqual({
          todos: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(String),
              title: expect.any(String),
              description: expect.any(String),
              completed: false,
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
            }),
          ]),
          pagination: expect.objectContaining({
            page: expect.any(Number),
            limit: expect.any(Number),
            total: expect.any(Number),
            totalPages: expect.any(Number),
            hasNext: expect.any(Boolean),
            hasPrevious: expect.any(Boolean),
          }),
        });
      });

      it("should handle search parameter and return matching todos", async () => {
        await setupTodos(db);
        const { body } = await request(app)
          .get("/api/v1/todos?search=Description for test todo 1")
          .expect(200);

        expect(body).toEqual({
          todos: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(String),
              title: "Test Todo 1",
              description: "Description for test todo 1",
              completed: false,
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
            }),
          ]),
          pagination: expect.objectContaining({
            page: expect.any(Number),
            limit: expect.any(Number),
            total: expect.any(Number),
            totalPages: expect.any(Number),
            hasNext: expect.any(Boolean),
            hasPrevious: expect.any(Boolean),
          }),
        });
      });

      it("should handle multiple query parameters correctly", async () => {
        await setupTodos(db);
        const { body } = await request(app)
          .get("/api/v1/todos?page=1&limit=10&completed=false&search=todo")
          .expect(200);

        expect(body).toEqual({
          todos: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(String),
              title: expect.any(String),
              description: expect.any(String),
              completed: false,
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
            }),
          ]),
          pagination: {
            page: 1,
            limit: 10,
            total: expect.any(Number),
            totalPages: expect.any(Number),
            hasNext: expect.any(Boolean),
            hasPrevious: expect.any(Boolean),
          },
        });
      });
    });

    describe("Error handling", () => {
      it("should handle invalid parameters gracefully with defaults", async () => {
        await setupTodos(db);
        const { body } = await request(app)
          .get("/api/v1/todos?page=invalid&limit=invalid&completed=invalid")
          .expect(200);

        expect(body).toEqual({
          todos: expect.any(Array),
          pagination: {
            page: 1, // Should default to 1
            limit: 10, // Should default to 10
            total: expect.any(Number),
            totalPages: expect.any(Number),
            hasNext: expect.any(Boolean),
            hasPrevious: expect.any(Boolean),
          },
        });
        expect(body.todos.length).toBeGreaterThan(0);
      });

      it("should limit maximum page size correctly", async () => {
        await setupTodos(db);
        const { body } = await request(app).get("/api/v1/todos?limit=1000").expect(200);

        expect(body).toEqual({
          todos: expect.any(Array),
          pagination: {
            page: expect.any(Number),
            limit: 100, // Should be capped at 100
            total: expect.any(Number),
            totalPages: expect.any(Number),
            hasNext: expect.any(Boolean),
            hasPrevious: expect.any(Boolean),
          },
        });
      });
    });

    describe("Edge cases", () => {
      it("should handle empty search results correctly", async () => {
        await setupTodos(db);
        const { body } = await request(app)
          .get("/api/v1/todos?search=nonexistentterm12345")
          .expect(200);

        expect(body).toEqual({
          todos: [],
          pagination: {
            page: expect.any(Number),
            limit: expect.any(Number),
            total: 0,
            totalPages: expect.any(Number),
            hasNext: expect.any(Boolean),
            hasPrevious: expect.any(Boolean),
          },
        });
      });

      describe("should handle invalid page numbers with defaults", () => {
        describe("page=-1", () => {
          it("should default to 1", async () => {
            await setupTodos(db);
            const { body: bodyNegative } = await request(app)
              .get("/api/v1/todos?page=-1")
              .expect(200);

            expect(bodyNegative).toEqual({
              todos: expect.any(Array),
              pagination: expect.objectContaining({
                page: 1, // Should default to 1
                limit: expect.any(Number),
                total: expect.any(Number),
                totalPages: expect.any(Number),
                hasNext: expect.any(Boolean),
                hasPrevious: expect.any(Boolean),
              }),
            });
          });
        });
        describe("page=0", () => {
          it("should default to 1", async () => {
            await setupTodos(db);
            const { body: bodyZero } = await request(app).get("/api/v1/todos?page=0").expect(200);

            expect(bodyZero).toEqual({
              todos: expect.any(Array),
              pagination: expect.objectContaining({
                page: 1, // Should default to 1
                limit: expect.any(Number),
                total: expect.any(Number),
                totalPages: expect.any(Number),
                hasNext: expect.any(Boolean),
                hasPrevious: expect.any(Boolean),
              }),
            });
          });
        });
      });
    });
  });

  xdescribe("GET /api/v1/todos/:id", () => {
    describe("Basic functionality", () => {
      it("should return specific todo with complete structure when ID exists", async () => {
        const { body } = await request(app).get("/api/v1/todos/1").expect(200);

        expect(body).toEqual({
          id: "1",
          title: "Learn TypeScript",
          description: "Study TypeScript fundamentals",
          completed: false,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        });
      });

      it("should return correct todos for various existing IDs", async () => {
        const expectedTodos = [
          {
            id: "1",
            title: "Learn TypeScript",
            description: "Study TypeScript fundamentals",
            completed: false,
          },
          {
            id: "2",
            title: "Build REST API",
            description: "Create a todo list API with Express",
            completed: false,
          },
          {
            id: "3",
            title: "Write tests",
            description: "Add comprehensive test coverage",
            completed: false,
          },
        ];

        for (const expectedTodo of expectedTodos) {
          const { body } = await request(app).get(`/api/v1/todos/${expectedTodo.id}`).expect(200);

          expect(body).toEqual({
            id: expectedTodo.id,
            title: expectedTodo.title,
            description: expectedTodo.description,
            completed: expectedTodo.completed,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          });
        }
      });
    });

    describe("Error handling", () => {
      it("should return 404 error for non-existent numeric ID", async () => {
        const { body } = await request(app).get("/api/v1/todos/999").expect(404);

        expect(body).toEqual({
          error: {
            code: "TODO_NOT_FOUND",
            message: "Todo with id '999' not found",
          },
        });
      });

      it("should return 404 error for non-existent non-numeric ID", async () => {
        const { body } = await request(app).get("/api/v1/todos/nonexistent").expect(404);

        expect(body).toEqual({
          error: {
            code: "TODO_NOT_FOUND",
            message: "Todo with id 'nonexistent' not found",
          },
        });
      });
    });
  });

  xdescribe("POST /api/v1/todos", () => {
    describe("Successful creation", () => {
      it("should create a new todo with title and description", async () => {
        const newTodo = {
          title: "New Test Todo",
          description: "This is a test todo",
        };

        const { body } = await request(app).post("/api/v1/todos").send(newTodo).expect(201);

        expect(body).toEqual({
          id: expect.any(String),
          title: "New Test Todo",
          description: "This is a test todo",
          completed: false,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        });
      });

      it("should create a new todo with only title", async () => {
        const newTodo = {
          title: "Simple Todo",
        };

        const { body } = await request(app).post("/api/v1/todos").send(newTodo).expect(201);

        expect(body).toEqual({
          id: expect.any(String),
          title: "Simple Todo",
          description: null,
          completed: false,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        });
      });
    });

    describe("Validation errors", () => {
      it("should return 400 when title is missing", async () => {
        const newTodo = {
          description: "Todo without title",
        };

        const { body } = await request(app).post("/api/v1/todos").send(newTodo).expect(400);

        expect(body).toEqual({
          error: {
            code: "MISSING_REQUIRED_FIELD",
            message: "Title is required",
          },
        });
      });

      it("should return 400 when title is empty", async () => {
        const newTodo = {
          title: "",
          description: "Empty title",
        };

        const { body } = await request(app).post("/api/v1/todos").send(newTodo).expect(400);

        expect(body).toEqual({
          error: {
            code: "MISSING_REQUIRED_FIELD",
            message: "Title is required",
          },
        });
      });

      it("should return 400 when title is too long", async () => {
        const newTodo = {
          title: "x".repeat(201), // 201 characters
          description: "Title too long",
        };

        const { body } = await request(app).post("/api/v1/todos").send(newTodo).expect(400);

        expect(body).toEqual({
          error: {
            code: "INVALID_TODO_DATA",
            message: "Todo title cannot exceed 200 characters",
          },
        });
      });
    });
  });

  xdescribe("PUT /api/v1/todos/:id", () => {
    describe("Successful updates", () => {
      it("should update a todo's title", async () => {
        const updates = {
          title: "Updated Title",
        };

        const { body } = await request(app).put("/api/v1/todos/1").send(updates).expect(200);

        expect(body).toEqual({
          id: "1",
          title: "Updated Title",
          description: "Study TypeScript fundamentals",
          completed: false,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        });
      });

      it("should update a todo's completion status", async () => {
        const updates = {
          completed: true,
        };

        const { body } = await request(app).put("/api/v1/todos/2").send(updates).expect(200);

        expect(body).toEqual({
          id: "2",
          title: "Build REST API",
          description: "Create a todo list API with Express",
          completed: true,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        });
      });

      it("should update multiple fields", async () => {
        const updates = {
          title: "Completely Updated Todo",
          description: "New description",
          completed: true,
        };

        const { body } = await request(app).put("/api/v1/todos/3").send(updates).expect(200);

        expect(body).toEqual({
          id: "3",
          title: "Completely Updated Todo",
          description: "New description",
          completed: true,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        });
      });

      it("should set description to null", async () => {
        const updates = {
          description: null,
        };

        const { body } = await request(app).put("/api/v1/todos/1").send(updates).expect(200);

        expect(body.description).toBeNull();
      });
    });

    describe("Error cases", () => {
      it("should return 404 for non-existent todo", async () => {
        const updates = {
          title: "Updated Title",
        };

        const { body } = await request(app).put("/api/v1/todos/999").send(updates).expect(404);

        expect(body).toEqual({
          error: {
            code: "TODO_NOT_FOUND",
            message: "Todo with id '999' not found",
          },
        });
      });

      it("should return 400 for invalid title", async () => {
        const updates = {
          title: "",
        };

        const { body } = await request(app).put("/api/v1/todos/1").send(updates).expect(400);

        expect(body).toEqual({
          error: {
            code: "INVALID_TODO_DATA",
            message: "Todo title cannot be empty",
          },
        });
      });

      it("should return 400 for title too long", async () => {
        const updates = {
          title: "x".repeat(201),
        };

        const { body } = await request(app).put("/api/v1/todos/1").send(updates).expect(400);

        expect(body).toEqual({
          error: {
            code: "INVALID_TODO_DATA",
            message: "Todo title cannot exceed 200 characters",
          },
        });
      });
    });
  });

  xdescribe("DELETE /api/v1/todos/:id", () => {
    describe("Successful deletion", () => {
      it("should delete an existing todo", async () => {
        // First verify the todo exists
        await request(app).get("/api/v1/todos/1").expect(200);

        // Delete the todo
        await request(app).delete("/api/v1/todos/1").expect(204);

        // Verify it's gone
        const { body } = await request(app).get("/api/v1/todos/1").expect(404);

        expect(body).toEqual({
          error: {
            code: "TODO_NOT_FOUND",
            message: "Todo with id '1' not found",
          },
        });
      });
    });

    describe("Error cases", () => {
      it("should return 404 for non-existent todo", async () => {
        const { body } = await request(app).delete("/api/v1/todos/999").expect(404);

        expect(body).toEqual({
          error: {
            code: "TODO_NOT_FOUND",
            message: "Todo with id '999' not found",
          },
        });
      });

      it("should return 400 for empty ID", async () => {
        const { body } = await request(app).delete("/api/v1/todos/").expect(404);

        expect(body).toEqual({
          error: {
            code: "ROUTE_NOT_FOUND",
            message: "Route DELETE /api/v1/todos/ not found",
          },
        });
      });
    });
  });
});

async function cleanupTodos(db: Pool) {
  const client = await db.connect();
  try {
    await client.query("DELETE FROM todos");
  } finally {
    client.release();
  }
}

async function setupTodos(db: Pool) {
  const client = await db.connect();
  try {
    await client.query(`
      INSERT INTO todos (title, description, completed)
      VALUES
        ('Test Todo 1', 'Description for test todo 1', false)
    `);
    await client.query(`
      INSERT INTO todos (title, description, completed)
      VALUES
        ('Test Todo 2', 'Description for test todo 2', true)
    `);
    const result = await client.query("SELECT id, title, description, completed FROM todos");
    const todos = result.rows.map(
      row => new Todo(row.id.toString(), row.title, row.description, row.completed)
    );
    return { todos };
  } finally {
    client.release();
  }
}
