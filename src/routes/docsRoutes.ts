import { Router, Request, Response } from "express";

/**
 * Documentation routes
 * Provides API documentation and usage information
 */
const docsRoutes = Router();

/**
 * @swagger
 * /api/v1/docs:
 *   get:
 *     summary: Get API documentation information
 *     description: Returns information about the API documentation and available endpoints
 *     tags: [Documentation]
 *     responses:
 *       200:
 *         description: API documentation information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Todo List API Documentation"
 *                 version:
 *                   type: string
 *                   example: "1.0.0"
 *                 documentation:
 *                   type: object
 *                   properties:
 *                     swagger_ui:
 *                       type: string
 *                       example: "/api-docs"
 *                     json_spec:
 *                       type: string
 *                       example: "/api-docs.json"
 *                 endpoints:
 *                   type: object
 *                   properties:
 *                     todos:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: [
 *                         "GET /api/v1/todos",
 *                         "GET /api/v1/todos/:id",
 *                         "POST /api/v1/todos",
 *                         "PUT /api/v1/todos/:id",
 *                         "DELETE /api/v1/todos/:id"
 *                       ]
 *                     health:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: [
 *                         "GET /health",
 *                         "GET /api/v1/health",
 *                         "GET /api/v1/health/readiness",
 *                         "GET /api/v1/health/liveness"
 *                       ]
 */
docsRoutes.get("/docs", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Todo List API Documentation",
    version: "1.0.0",
    documentation: {
      swagger_ui: "/api-docs",
      json_spec: "/api-docs.json",
      description: "Complete API documentation with interactive testing interface",
    },
    endpoints: {
      todos: [
        "GET /api/v1/todos - Get all todos with pagination and filtering",
        "GET /api/v1/todos/:id - Get a specific todo",
        "POST /api/v1/todos - Create a new todo",
        "PUT /api/v1/todos/:id - Update a todo",
        "DELETE /api/v1/todos/:id - Delete a todo",
      ],
      health: [
        "GET /health - Root level health check",
        "GET /api/v1/health - API health check",
        "GET /api/v1/health/readiness - Readiness probe",
        "GET /api/v1/health/liveness - Liveness probe",
      ],
    },
    examples: {
      create_todo: {
        url: "POST /api/v1/todos",
        body: {
          title: "Complete project documentation",
          description: "Write comprehensive documentation for the todo API project",
        },
      },
      get_todos_with_filter: {
        url: "GET /api/v1/todos?completed=false&limit=5&page=1",
        description: "Get first 5 incomplete todos",
      },
    },
  });
});

export { docsRoutes };
