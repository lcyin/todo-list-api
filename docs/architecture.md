# Architecture

This project follows a clean architecture pattern with comprehensive authentication, multi-layer validation, and advanced error handling.

1. Controllers - Handle HTTP requests/responses, authentication, and structured error throwing
2. Services - Contain business logic, user management, and JWT token handling
3. Repositories - Manage PostgreSQL database operations with connection pooling
4. Middleware - Handle authentication, validation, error handling, and logging
5. Schemas - Define input/output validation with Zod and OpenAPI generation
6. Interfaces - Define TypeScript contracts for type safety
7. Error Management - Centralized error codes, custom interfaces, and structured responses
8. Authentication System - JWT-based auth with user registration, login, and profile management
9. Database Layer - PostgreSQL with migrations, connection pooling, and environment isolation
10. Documentation - Auto-generated OpenAPI/Swagger docs from Zod schemas
