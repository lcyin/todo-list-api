import app from "./app";
import { config } from "./config";

/**
 * Start the server
 * Entry point for the Todo List API application
 */
const startServer = (): void => {
  try {
    const server = app.listen(config.server.port, "0.0.0.0", () => {
      console.log(`
🚀 Todo List API Server is running!
📍 Environment: ${config.server.nodeEnv}
🌐 Port: ${config.server.port}
🌐 Host: 0.0.0.0 (all interfaces)
📡 Health Check: http://localhost:${config.server.port}/health
📚 API Base: http://localhost:${config.server.port}${config.api.prefix}/${config.api.version}
🌟 Swagger UI: http://localhost:${config.server.port}/api-docs
📄 Swagger JSON: http://localhost:${config.server.port}/api-docs.json
      `);
    });

    // Add error handling for the server
    server.on("error", (error: NodeJS.ErrnoException) => {
      if (error.code === "EADDRINUSE") {
        console.error(`❌ Port ${config.server.port} is already in use`);
      } else {
        console.error("❌ Server error:", error);
      }
      process.exit(1);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

// Start the server
startServer();
