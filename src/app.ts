import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import todoRoutes from "./routes/todos.route";
import { authRoutes } from "./routes/auth.route";
import { errorHandler } from "./middleware/errorHandler";
import { requestLogger, addRequestId } from "./middleware/requestLogger";
import logger from "./config/logger";
import { generateOpenAPIDocument } from "./config/openapi";
import { envConfig } from "./config/config";

console.log("Environment Configuration:", envConfig);
const {
  port,
  logging: { level, silent },
  nodeEnv,
} = envConfig;
const app: Application = express();

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS

// Request logging middleware (before Morgan)
app.use(addRequestId);
app.use(requestLogger);

// Morgan HTTP logging (simplified since we have custom logging)
app.use(
  morgan("combined", {
    stream: {
      write: (message: string) => {
        logger.http(message.trim());
      },
    },
  })
);
logger.info(
  `Morgan HTTP request logging initialized, format: combined, transports: ${logger.transports
    .map((t) => t.constructor.name)
    .join(", ")}`
);
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Swagger Documentation
const swaggerDocument = generateOpenAPIDocument();
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    explorer: true,
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "Todo List API Documentation",
  })
);

// OpenAPI JSON endpoint
app.get("/api-docs.json", (req: Request, res: Response) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerDocument);
});

// Routes
app.use("/auth", authRoutes);
app.use("/todos", todoRoutes);

// Health check endpoint
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "OK",
    message: "Todo List API is running",
    timestamp: new Date().toISOString(),
  });
});

// Root endpoint
app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Welcome to Todo List API",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      auth: "/api/auth",
      todos: "/api/todos",
      documentation: "/api-docs",
      openapi: "/api-docs.json",
    },
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: "Route not found",
    message: `Cannot ${req.method} ${req.path}`,
  });
});

// Global error handler
app.use(errorHandler);

if (nodeEnv !== "test") {
  // Start server
  app.listen(port, () => {
    logger.info(`🚀 Server running on port ${port}`, {
      port,
      environment: nodeEnv || "development",
      timestamp: new Date().toISOString(),
    });
    logger.info(`📚 API Documentation: http://localhost:${port}/api-docs`);
    logger.info(`📖 OpenAPI JSON: http://localhost:${port}/api-docs.json`);
    logger.info(`🏥 Health Check: http://localhost:${port}/health`);
  });
}

export default app;
