import request from "supertest";
import app from "../app";

describe("GET /api/v1/todos", () => {
  describe("Basic functionality", () => {
    it("should return 200 and a list of todos", async () => {
      const { body } = await request(app).get("/api/v1/todos").expect(200);

      expect(body).toEqual({
        todos: [
          {
            id: "1",
            title: "Learn TypeScript",
            description: "Study TypeScript fundamentals",
            completed: false,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          },
          {
            id: "2",
            title: "Build REST API",
            description: "Create a todo list API with Express",
            completed: false,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          },
          {
            id: "3",
            title: "Write tests",
            description: "Add comprehensive test coverage",
            completed: false,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          },
          {
            id: "4",
            title: "Deploy application",
            description: "Deploy to production environment",
            completed: true,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          },
          {
            id: "5",
            title: "Update documentation",
            description: "Keep README and docs up to date",
            completed: true,
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
      expect(body.todos.length).toBeLessThanOrEqual(2);
    });

    it("should handle completed filter and return filtered todos", async () => {
      const { body: bodyTrue } = await request(app).get("/api/v1/todos?completed=true").expect(200);

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
      const { body } = await request(app).get("/api/v1/todos?search=TypeScript").expect(200);

      expect(body).toEqual({
        todos: expect.arrayContaining([
          expect.objectContaining({
            id: "1",
            title: "Learn TypeScript",
            description: "Study TypeScript fundamentals",
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

    it("should handle invalid page numbers with defaults", async () => {
      const { body: bodyNegative } = await request(app).get("/api/v1/todos?page=-1").expect(200);

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

describe("GET /api/v1/todos/:id", () => {
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
