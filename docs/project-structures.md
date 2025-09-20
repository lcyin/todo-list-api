

## Project Structure

```
src/
├── app.ts                     # Main application entry point
├── config/                    # Configuration files
│   ├── config.ts             # Application configuration
│   ├── database.ts           # Database connection & pooling
│   ├── environment.ts        # Environment variable management
│   ├── logger.ts             # Winston logger configuration
│   ├── openapi.ts            # OpenAPI documentation generator
│   └── openapi-routes.ts     # OpenAPI route documentation
├── controllers/               # Request handlers (HTTP layer)
│   ├── auth.controller.ts    # Authentication endpoints
│   ├── auth.controller.int-spec.ts # Auth integration tests
│   ├── todos.controller.ts   # Todo CRUD endpoints
│   └── todos.controller.int-spec.ts # Todo integration tests
├── services/                  # Business logic layer
│   ├── auth.service.ts       # Authentication & user management
│   ├── jwt.service.ts        # JWT token management
│   └── todos.service.ts      # Todo business logic
├── repositories/              # Data access layer
│   ├── todos.repository.ts   # Todo database operations
│   └── users.repository.ts   # User database operations
├── middleware/                # Custom middleware
│   ├── auth.middleware.ts    # JWT authentication middleware
│   ├── errorHandler.ts       # Centralized error handling
│   ├── requestLogger.ts      # Request/response logging
│   ├── validation.ts         # Zod validation middleware
│   ├── enums/
│   │   └── error-code.enum.ts # Error classification system
│   └── interfaces/
│       └── errore-interface.ts # Error interfaces
├── routes/                    # Route definitions
│   ├── auth.route.ts         # Authentication routes
│   └── todos.route.ts        # Todo routes
├── schemas/                   # Zod validation schemas
│   ├── auth.schema.ts        # Authentication validation
│   └── todos.schema.ts       # Todo validation
├── interfaces/                # TypeScript interfaces
│   ├── auth.interface.ts     # Authentication types
│   └── todos.interface.ts    # Todo types
├── scripts/                   # Utility scripts
│   ├── migrate.ts            # Database migration runner
│   └── generate-openapi.ts   # OpenAPI documentation generator
├── test/                      # Test setup and utilities
│   └── setup/
│       └── test-db-connection.ts # Test database configuration
├── components/                # Reusable components
│   ├── users.component.ts    # User management component
│   └── users.component.int-spec.ts # User component tests
├── utils/                     # Utility functions
│   └── throw-custom-error.helper.ts # Error helper utilities
├── domain/                    # Domain layer (future use)
│   └── ports/                # Port interfaces for clean architecture
└── validation/                # Additional validation utilities

migrations/                    # Database migration files
├── 001_create_todos_table.sql # Initial todos table
├── 002_create_users_table.sql # Users table with authentication
├── 003_add_user_id_to_todos.sql # Link todos to users
└── 004_add_delete_at_users.sql # Soft delete for users

docs/                          # Documentation
├── README.md                 # Zod to OpenAPI documentation
├── ZOD_OPENAPI_GUIDE.md     # OpenAPI generation guide
└── openapi.json             # Generated OpenAPI specification

schemas/                      # External schema files (if any)
logs/                         # Application log files
├── app.log                  # General application logs
├── app-YYYY-MM-DD.log      # Daily rotating logs
├── exceptions.log           # Exception logs
└── rejections.log           # Promise rejection logs
```
