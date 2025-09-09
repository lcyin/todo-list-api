import app from "../app";
import request from "supertest";

describe("TodoController API Response Shape Tests", () => {
  const appInstance = app;

  describe("GET /api/todos", () => {
    it("should return correct response shape for getAllTodos", async () => {
      const response = await request(appInstance).get("/api/todos").expect(200);

      expect(response.body).toEqual({
        data: [
          {
            completed: false,
            createdAt: expect.any(String),
            description: "Study Node.js fundamentals",
            id: "1",
            title: "Learn Node.js",
            updatedAt: expect.any(String),
          },
          {
            completed: true,
            createdAt: expect.any(String),
            description: "Use Express.js to create a robust API",
            id: "2",
            title: "Build a REST API",
            updatedAt: expect.any(String),
          },
          {
            completed: false,
            createdAt: expect.any(String),
            description:
              "Deep dive into TypeScript features and best practices",
            id: "3",
            title: "Explore TypeScript",
            updatedAt: expect.any(String),
          },
          {
            completed: false,
            createdAt: expect.any(String),
            description:
              "Implement continuous integration and deployment pipelines",
            id: "4",
            title: "Set up CI/CD",
            updatedAt: expect.any(String),
          },
        ],
        message: "Todos retrieved successfully",
        success: true,
      });
    });
  });
});
