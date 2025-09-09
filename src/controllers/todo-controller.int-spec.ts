import app from "../app";
import request from "supertest";

describe("TodoController API Response Shape Tests", () => {
  const appInstance = app;

  describe("GET /api/todos", () => {
    it("should return correct response shape for getAllTodos", async () => {
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
        },
        status: 200,
      });
    });
  });

  describe("GET /api/todos/:id", () => {
    it("should return correct response shape for getTodoById", async () => {
      const testTodo = {
        description: "Study Node.js fundamentals",
        title: "Learn Node.js",
      };
      const { body: createdTodo } = await request(appInstance)
        .post("/api/todos")
        .send({
          title: testTodo.title,
          description: testTodo.description,
        });

      const { body, status } = await request(appInstance).get(
        "/api/todos/:id".replace(":id", createdTodo.data.id)
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
            id: createdTodo.data.id,
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
      const testTodo = {
        description: "Study Node.js fundamentals",
        title: "Learn Node.js",
      };
      const { body: createdTodo } = await request(appInstance)
        .post("/api/todos")
        .send({
          title: testTodo.title,
          description: testTodo.description,
        });

      const updates = {
        title: "Updated Todo",
        description: "This todo has been updated",
        completed: true,
      };

      const response = await request(appInstance)
        .put("/api/todos/:id".replace(":id", createdTodo.data.id))
        .send(updates);

      expect(response.body).toEqual({
        data: {
          id: createdTodo.data.id,
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
      const testTodo = {
        description: "Study Node.js fundamentals",
        title: "Learn Node.js",
      };
      const { body: createdTodo } = await request(appInstance)
        .post("/api/todos")
        .send({
          title: testTodo.title,
          description: testTodo.description,
        });
      const response = await request(appInstance)
        .delete("/api/todos/:id".replace(":id", createdTodo.data.id))
        .expect(200);

      expect(response.body).toEqual({
        data: null,
        message: "Todo deleted successfully",
        success: true,
      });
    });
  });
});
