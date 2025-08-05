import express, { Application, Request, Response, NextFunction } from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import { config } from "./config";
import { routes } from "./routes";

/**
 * Express application setup
 * Configures middleware, routes, and error handling following REST API standards
 */
class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  /**
   * Configure application middleware
   * Following security and performance best practices
   */
  private setupMiddleware(): void {
    // Security middleware - sets various HTTP headers
    this.app.use(helmet());

    // CORS middleware - enable cross-origin requests
    this.app.use(
      cors({
        origin: config.isDevelopment ? "*" : [], // Configure allowed origins for production
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        allowedHeaders: ["Content-Type", "Authorization", "X-API-Version"],
      })
    );

    // Request logging middleware
    this.app.use(morgan(config.isDevelopment ? "dev" : "combined"));

    // Body parsing middleware
    this.app.use(express.json({ limit: "10mb" }));
    this.app.use(express.urlencoded({ extended: true, limit: "10mb" }));
  }

  /**
   * Configure application routes
   * Mounts all route modules under the API prefix
   */
  private setupRoutes(): void {
    // Mount all routes under API prefix with versioning
    this.app.use(`${config.api.prefix}/${config.api.version}`, routes);

    // Root level health check (common pattern for load balancers)
    this.app.get("/health", (req: Request, res: Response) => {
      res.status(200).json({
        status: "healthy",
        timestamp: new Date().toISOString(),
        message: "Todo List API is running",
      });
    });

    // Handle 404 for unmatched routes
    this.app.use("*", (req: Request, res: Response) => {
      res.status(404).json({
        error: {
          code: "ROUTE_NOT_FOUND",
          message: `Route ${req.method} ${req.originalUrl} not found`,
        },
      });
    });
  }

  /**
   * Configure global error handling
   * Implements consistent error response format
   */
  private setupErrorHandling(): void {
    this.app.use(
      (error: Error, req: Request, res: Response, next: NextFunction) => {
        // Log error for debugging
        console.error("Error:", error);

        // Send consistent error response
        res.status(500).json({
          error: {
            code: "INTERNAL_SERVER_ERROR",
            message: config.isDevelopment
              ? error.message
              : "Something went wrong",
            ...(config.isDevelopment && { stack: error.stack }),
          },
        });
      }
    );
  }
}

export default new App().app;
