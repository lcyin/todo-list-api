import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import todoRoutes from "./routes/todos.route";
import { errorHandler } from "./middleware/errorHandler";
import { requestLogger, addRequestId } from "./middleware/requestLogger";
import logger from "./config/logger";
import { transports } from "winston";

const app: Application = express();
const PORT = process.env.PORT || 3000;

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

// Routes
app.use("/api/todos", todoRoutes);

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
      todos: "/api/todos",
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

if (process.env.NODE_ENV !== "test") {
  // Start server
  app.listen(PORT, () => {
    logger.info(`🚀 Server running on port ${PORT}`, {
      port: PORT,
      environment: process.env.NODE_ENV || "development",
      timestamp: new Date().toISOString(),
    });
    logger.info(`📚 API Documentation: http://localhost:${PORT}`);
    logger.info(`🏥 Health Check: http://localhost:${PORT}/health`);
  });
}

export default app;
