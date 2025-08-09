import request from "supertest";
import app from "../app";

interface TodoResponse {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

describe("GET /api/v1/todos", () => {
  describe("Basic functionality", () => {
    it("should return 200 and a list of todos", async () => {
      const response = await request(app).get("/api/v1/todos").expect(200);

      expect(response.body).toHaveProperty("todos");
      expect(response.body).toHaveProperty("pagination");
      expect(Array.isArray(response.body.todos)).toBe(true);
      expect(response.body.todos.length).toBeGreaterThan(0);
    });

    it("should return todos with correct structure", async () => {
      const response = await request(app).get("/api/v1/todos").expect(200);

      const firstTodo = response.body.todos[0];
      expect(firstTodo).toHaveProperty("id");
      expect(firstTodo).toHaveProperty("title");
      expect(firstTodo).toHaveProperty("description");
      expect(firstTodo).toHaveProperty("completed");
      expect(firstTodo).toHaveProperty("createdAt");
      expect(firstTodo).toHaveProperty("updatedAt");

      expect(typeof firstTodo.id).toBe("string");
      expect(typeof firstTodo.title).toBe("string");
      expect(typeof firstTodo.completed).toBe("boolean");
      expect(typeof firstTodo.createdAt).toBe("string");
      expect(typeof firstTodo.updatedAt).toBe("string");
    });

    it("should return pagination information", async () => {
      const response = await request(app).get("/api/v1/todos").expect(200);

      expect(response.body.pagination).toHaveProperty("page");
      expect(response.body.pagination).toHaveProperty("limit");
      expect(response.body.pagination).toHaveProperty("total");
      expect(response.body.pagination).toHaveProperty("totalPages");
      expect(response.body.pagination).toHaveProperty("hasNext");
      expect(response.body.pagination).toHaveProperty("hasPrevious");

      expect(typeof response.body.pagination.page).toBe("number");
      expect(typeof response.body.pagination.limit).toBe("number");
      expect(typeof response.body.pagination.total).toBe("number");
      expect(typeof response.body.pagination.totalPages).toBe("number");
      expect(typeof response.body.pagination.hasNext).toBe("boolean");
      expect(typeof response.body.pagination.hasPrevious).toBe("boolean");
    });
  });

  describe("Query parameters", () => {
    it("should handle page parameter", async () => {
      const response = await request(app).get("/api/v1/todos?page=1").expect(200);

      expect(response.body.pagination.page).toBe(1);
    });

    it("should handle limit parameter", async () => {
      const response = await request(app).get("/api/v1/todos?limit=2").expect(200);

      expect(response.body.pagination.limit).toBe(2);
      expect(response.body.todos.length).toBeLessThanOrEqual(2);
    });

    it("should handle completed filter", async () => {
      const responseTrue = await request(app).get("/api/v1/todos?completed=true").expect(200);

      responseTrue.body.todos.forEach((todo: TodoResponse) => {
        expect(todo.completed).toBe(true);
      });

      const responseFalse = await request(app).get("/api/v1/todos?completed=false").expect(200);

      responseFalse.body.todos.forEach((todo: TodoResponse) => {
        expect(todo.completed).toBe(false);
      });
    });

    it("should handle search parameter", async () => {
      const response = await request(app).get("/api/v1/todos?search=TypeScript").expect(200);

      response.body.todos.forEach((todo: TodoResponse) => {
        const matchesSearch =
          todo.title.toLowerCase().includes("typescript") ||
          (todo.description && todo.description.toLowerCase().includes("typescript"));
        expect(matchesSearch).toBe(true);
      });
    });

    it("should handle multiple query parameters", async () => {
      const response = await request(app)
        .get("/api/v1/todos?page=1&limit=10&completed=false&search=todo")
        .expect(200);

      expect(response.body.pagination.page).toBe(1);
      expect(response.body.pagination.limit).toBe(10);
      response.body.todos.forEach((todo: TodoResponse) => {
        expect(todo.completed).toBe(false);
      });
    });
  });

  describe("Error handling", () => {
    it("should handle invalid page parameter gracefully", async () => {
      const response = await request(app).get("/api/v1/todos?page=invalid").expect(200);

      expect(response.body.pagination.page).toBe(1); // Should default to 1
    });

    it("should handle invalid limit parameter gracefully", async () => {
      const response = await request(app).get("/api/v1/todos?limit=invalid").expect(200);

      expect(response.body.pagination.limit).toBe(10); // Should default to 10
    });

    it("should handle invalid completed parameter gracefully", async () => {
      const response = await request(app).get("/api/v1/todos?completed=invalid").expect(200);

      // Should return all todos (no filter applied)
      expect(response.body.todos.length).toBeGreaterThan(0);
    });

    it("should limit maximum page size", async () => {
      const response = await request(app).get("/api/v1/todos?limit=1000").expect(200);

      expect(response.body.pagination.limit).toBe(100); // Should be capped at 100
    });
  });

  describe("Edge cases", () => {
    it("should handle empty search results", async () => {
      const response = await request(app)
        .get("/api/v1/todos?search=nonexistentterm12345")
        .expect(200);

      expect(response.body.todos).toHaveLength(0);
      expect(response.body.pagination.total).toBe(0);
    });

    it("should handle negative page numbers", async () => {
      const response = await request(app).get("/api/v1/todos?page=-1").expect(200);

      expect(response.body.pagination.page).toBe(1); // Should default to 1
    });

    it("should handle zero page numbers", async () => {
      const response = await request(app).get("/api/v1/todos?page=0").expect(200);

      expect(response.body.pagination.page).toBe(1); // Should default to 1
    });
  });
});
