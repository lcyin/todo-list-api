# Todo List API

A comprehensive RESTful API for managing todos and user authentication built with Express.js and TypeScript following clean architecture principles.

## Features

- ✅ Full CRUD operations for todos
- 🔐 **User authentication and authorization (JWT)**
- 👤 **User registration, login, and profile management**
- 🏗️ Layered architecture (Controller → Service → Repository)
- 🗄️ **PostgreSQL database with connection pooling**
- 📋 **Database migrations and schema management**
- 🔒 Security middleware (Helmet)
- 🌐 CORS enabled
- 📝 **Comprehensive logging with Winston and Morgan**
- 🛡️ **Advanced error handling system with ErrorCode enum**
- ⚠️ **Structured error types and detailed error responses**
- ✨ **Input validation with Zod**
- 📚 **Auto-generated OpenAPI/Swagger documentation**
- 🧪 **Automated testing with Jest and Supertest**
- 📊 TypeScript for complete type safety
- 🚀 Hot reload with Nodemon
- 🔄 Dependency injection pattern
- 🌍 **Multi-environment configuration (dev/test/prod)**

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server:
```bash
npm run dev
```

The server will run on `http://localhost:3000`

### Production

Build and start the production server:
```bash
npm run build
npm start
```

## API Endpoints

### Health Check

- `GET /health` - Check API status

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user (with token blacklisting)
- `GET /api/auth/profile` - Get current user profile (requires auth)
- `PUT /api/auth/profile` - Update user profile (requires auth)
- `PUT /api/auth/change-password` - Change user password (requires auth)
- `POST /api/auth/verify-token` - Verify JWT token validity

### Todos

- `GET /api/todos` - Get all todos for authenticated user
- `GET /api/todos/:id` - Get todo by ID (user-owned only)
- `POST /api/todos` - Create new todo for authenticated user
- `PUT /api/todos/:id` - Update user's todo
- `DELETE /api/todos/:id` - Delete user's todo

### Documentation

- `GET /api-docs` - Interactive Swagger UI documentation
- `GET /api-docs.json` - OpenAPI JSON specification

### Example Requests

#### Register User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

#### Login User

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123"
  }'
```

#### Create Todo (Authenticated)

```bash
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"title": "Learn TypeScript", "description": "Study TS fundamentals"}'
```

#### Get User's Todos

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:3000/api/todos
```

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

### Architecture

This project follows a **clean architecture** pattern with **comprehensive authentication**, **multi-layer validation**, and **advanced error handling**:

1. **Controllers** - Handle HTTP requests/responses, authentication, and structured error throwing
2. **Services** - Contain business logic, user management, and JWT token handling
3. **Repositories** - Manage PostgreSQL database operations with connection pooling
4. **Middleware** - Handle authentication, validation, error handling, and logging
5. **Schemas** - Define input/output validation with Zod and OpenAPI generation
6. **Interfaces** - Define TypeScript contracts for type safety
7. **Error Management** - Centralized error codes, custom interfaces, and structured responses
8. **Authentication System** - JWT-based auth with user registration, login, and profile management
9. **Database Layer** - PostgreSQL with migrations, connection pooling, and environment isolation
10. **Documentation** - Auto-generated OpenAPI/Swagger docs from Zod schemas

## Development Guidelines

When adding new features:

1. **Create interfaces** in `src/interfaces/` for any new data structures
2. **Define validation schemas** in `src/schemas/` using Zod for both validation and OpenAPI generation
3. **Add repository methods** in `src/repositories/` for database operations
4. **Implement business logic** in `src/services/` with proper error handling
5. **Create controller methods** in `src/controllers/` for HTTP handling and authentication checks
6. **Define routes** in `src/routes/` with validation middleware and authentication
7. **Add integration tests** in `*.int-spec.ts` files for full API testing
8. **Update OpenAPI documentation** via Zod schema annotations
9. **Consider user authorization** for multi-user data access patterns
10. **Add database migrations** for schema changes in `migrations/` directory

## Input Validation with Zod

This project uses **Zod** for runtime type checking and input validation:

### Validation Features:
- **Type-safe schemas** with TypeScript integration
- **Request validation** for body, parameters, and query strings
- **Custom error messages** with detailed validation feedback
- **Data transformation** (trimming, optional field handling)
- **Consistent error responses** following API format

### Schema Structure:
```typescript
// Example schema for creating a todo
export const createTodoSchema = z.object({
  body: z.object({
    title: z.string().trim().min(1, 'Title is required').max(200),
    description: z.string().max(1000).optional()
  })
});
```

### Validation Rules:
- **Title**: Required, 1-200 characters, automatically trimmed
- **Description**: Optional, max 1000 characters
- **ID Parameters**: Must be valid UUID format
- **Updates**: At least one field required for update operations

### Error Response Format:
```json
{
  "success": false,
  "error": "Validation failed: body.title: Title is required"
}
```

## Error Handling Strategy

The application implements an enterprise-grade error handling system with structured error management, comprehensive logging, and consistent client responses. This system provides robust error classification, detailed debugging information, and maintains security while offering helpful error messages.

### Error Handling Architecture

#### 1. **Comprehensive Error Classification System**

The application uses a centralized `ErrorCode` enum that categorizes all possible error scenarios:

```typescript
export enum ErrorCode {
  // Validation Errors
  VALIDATION_ERROR = "VALIDATION_ERROR",

  // Resource Errors  
  TODO_NOT_FOUND = "TODO_NOT_FOUND",
  USER_NOT_FOUND = "USER_NOT_FOUND",

  // Business Logic Errors
  INVALID_TODO_STATE = "INVALID_TODO_STATE",

  // Authentication/Authorization Errors
  AUTHENTICATION_ERROR = "AUTHENTICATION_ERROR", 
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
  USER_ALREADY_EXISTS = "USER_ALREADY_EXISTS",
  INVALID_CREDENTIALS = "INVALID_CREDENTIALS",

  // System Errors
  DATABASE_ERROR = "DATABASE_ERROR",
  INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR"
}
```

#### 2. **Custom Error Interface**

All errors implement a structured interface that provides context and classification:

```typescript
export interface CustomError extends Error {
  statusCode?: number;       // HTTP status code override
  type: ErrorCode;          // Error classification
  details?: ErrorDetails[]; // Additional error context
}
```

#### 3. **Error Details Interface**

Provides granular error information for debugging and validation:

```typescript
export interface ErrorDetails {
  field?: string;      // Field that caused the error
  value?: any;         // Invalid value provided
  constraint?: string; // Validation constraint violated
  code?: string;       // Specific error code
}
```

### Error Handling Flow & Pipeline

#### **1. Error Generation Phase**

- **Controllers**: Validate inputs and throw business logic errors
- **Services**: Handle business rule violations and resource not found scenarios
- **Repositories**: Convert database errors to application errors
- **Middleware**: Catch authentication, authorization, and validation errors

#### **2. Error Processing Pipeline**

```text
[Error Thrown] → [Error Middleware] → [Error Classification] → [Logging] → [Response Generation]
```

#### **3. Centralized Error Middleware**

The error middleware (`src/middleware/errorHandler.ts`) processes all errors:

1. **Error Type Classification**: Maps ErrorCode to appropriate HTTP status codes
2. **Security Filtering**: Prevents sensitive information leakage in production
3. **Structured Logging**: Records detailed error context for debugging
4. **Response Standardization**: Returns consistent error response format

#### **4. HTTP Status Code Mapping**

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Input validation failures |
| `INVALID_TODO_STATE` | 400 | Business logic violations |
| `TODO_NOT_FOUND` | 404 | Resource not found |
| `USER_NOT_FOUND` | 404 | User resource not found |
| `AUTHENTICATION_ERROR` | 401 | Authentication required |
| `UNAUTHORIZED` | 401 | Invalid credentials |
| `FORBIDDEN` | 403 | Access denied |
| `USER_ALREADY_EXISTS` | 400 | Duplicate user registration |
| `INVALID_CREDENTIALS` | 400 | Login credential errors |
| `DATABASE_ERROR` | 500 | Data persistence issues |
| `INTERNAL_SERVER_ERROR` | 500 | Unexpected system errors |

### Error Response Examples

#### **Validation Error (400)**

Input validation failures with specific field information:

```json
{
  "success": false,
  "error": "Validation failed: body.title: Title is required"
}
```

#### **Authentication Error (401)**

Authentication required or token invalid:

```json
{
  "success": false,
  "error": "Authentication required. Please provide a valid token."
}
```

#### **Resource Not Found (404)**

Specific resource identification for debugging:

```json
{
  "success": false,
  "error": "Todo not found, id: 123e4567-e89b-12d3-a456-426614174000"
}
```

#### **Business Logic Error (400)**

Clear business rule violation messages:

```json
{
  "success": false,
  "error": "Cannot update completed todo. Mark as incomplete first."
}
```

#### **User Authorization Error (403)**

Access control violations:

```json
{
  "success": false,
  "error": "Access denied. You can only access your own todos."
}
```

#### **Database Error (500)**

Secure database error responses (no sensitive info leaked):

```json
{
  "success": false,
  "error": "Database error occurred"
}
```

#### **User Registration Conflict (400)**

Clear duplicate resource messages:

```json
{
  "success": false,
  "error": "User with email 'user@example.com' already exists"
}
```

### Development vs Production Error Handling

#### **Development Mode Features**

- **Stack Traces**: Full error stack traces for debugging
- **Detailed Error Messages**: Complete error context and technical details
- **Database Error Details**: Specific database constraint violations
- **Request Context**: Full request information in error logs

#### **Production Mode Security**

- **Sanitized Messages**: Generic error messages for security
- **No Stack Traces**: Stack traces excluded from client responses
- **Filtered Logging**: Sensitive information removed from logs
- **Error Aggregation**: Structured error reporting for monitoring

### Comprehensive Error Logging System

#### **Error Log Structure**

```typescript
const errorLog = {
  requestId: "req_123abc",           // Unique request identifier
  method: "POST",                   // HTTP method
  url: "/api/todos",               // Request URL
  statusCode: 400,                 // Response status code
  errorType: "VALIDATION_ERROR",   // Error classification
  errorMessage: "Title is required", // Error message
  stack: "Error: Title is required...", // Stack trace
  details: [                       // Additional error context
    {
      field: "title",
      value: "",
      constraint: "min_length"
    }
  ]
};
```

#### **Log Level Strategy**

- **Client Errors (4xx)**: Logged as `WARN` level for monitoring
- **Server Errors (5xx)**: Logged as `ERROR` level for immediate attention
- **Request Context**: All errors include request ID for tracing

### Error Helper Utilities

#### **Database Error Mapping**

Converts database-specific errors to application errors:

```typescript
export function mapDBErrorToAppError(error: any, message: string): Error {
  const appError = new Error(message);
  (appError as any).type = ErrorCode.DATABASE_ERROR;
  (appError as any).originalError = error;
  return appError;
}
```

#### **Custom Error Throwing**

Consistent error generation throughout the application:

```typescript
// Example usage in services
throw { 
  message: "Todo not found", 
  type: ErrorCode.TODO_NOT_FOUND 
} as CustomError;
```

### Error Testing Strategy

#### **Integration Test Coverage**

- All error scenarios are tested in `*.int-spec.ts` files
- Response shape validation ensures consistent error formats
- HTTP status code verification for all error types
- Error message content validation

#### **Error Scenario Testing**

```typescript
// Example test cases
it('should return 404 for non-existent todo', async () => {
  const response = await request(app)
    .get('/api/todos/invalid-id')
    .expect(404);
    
  expect(response.body).toEqual({
    success: false,
    error: expect.stringContaining('Todo not found')
  });
});
```

### Security Considerations

#### **Error Information Security**

1. **Production Sanitization**: Sensitive error details filtered in production
2. **Stack Trace Protection**: Stack traces never exposed to clients in production
3. **Database Error Masking**: Database constraint violations genericized
4. **Authentication Error Consistency**: Auth errors provide minimal information to prevent enumeration attacks

#### **Logging Security**

1. **Password Filtering**: Passwords never logged in plain text
2. **Token Protection**: JWT tokens sanitized in error logs
3. **PII Handling**: Personal information filtered from error messages
4. **Request Sanitization**: Sensitive headers excluded from logs

### Error Monitoring & Observability

#### **Error Metrics**

- Error rate by endpoint
- Error type distribution
- Response time impact of errors
- User error patterns

#### **Debugging Features**

- **Request ID Tracking**: Every request gets unique ID for tracing
- **Error Correlation**: Link errors to specific user actions
- **Performance Impact**: Error handling performance monitoring
- **Alert Integration**: Error thresholds trigger monitoring alerts

### Implementation Benefits

1. **Consistent Error Experience**: All errors follow the same response format
2. **Developer Debugging**: Rich error context speeds up development
3. **Production Security**: Secure error responses protect sensitive information
4. **Error Monitoring**: Comprehensive logging enables proactive error management
5. **Type Safety**: Full TypeScript integration prevents error handling bugs
6. **Maintainability**: Centralized error handling simplifies code maintenance
7. **Testing Coverage**: Complete error scenario testing ensures reliability
8. **Business Logic Clarity**: Clear error messages improve user experience

This error handling strategy ensures that the application provides excellent developer experience during development while maintaining enterprise-grade security and monitoring capabilities in production environments.

## Testing

The project includes comprehensive automated testing using **Jest** and **Supertest** for API response shape validation and integration testing.

### Testing Strategy

- **Integration Tests**: Full API endpoint testing with Supertest
- **Response Shape Validation**: Ensures consistent API response structures
- **API Contract Testing**: Validates that all endpoints return expected data formats
- **Environment Isolation**: Tests run in isolated test environment with proper setup/teardown

### Test Configuration

- **Jest with TypeScript**: Uses `ts-jest` preset for TypeScript support
- **Test Environment**: Node.js environment for backend API testing
- **Test Pattern**: `*.int-spec.ts` files for integration tests
- **Test Timeout**: 15 seconds for API calls
- **Sequential Execution**: Tests run one at a time to avoid port conflicts
- **Force Exit**: Properly handles async operations and server cleanup

### Test Scripts

```bash
# Run all tests with minimal output (default)
npm test

# Run tests in watch mode for development
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run tests with detailed output
npm run test:verbose
```

### Current Test Coverage

The integration tests comprehensively cover all API endpoints:

- **GET /api/todos** - List all todos with response shape validation
- **GET /api/todos/:id** - Get specific todo by ID with proper error handling
- **POST /api/todos** - Create new todo with validation and response verification
- **PUT /api/todos/:id** - Update existing todo with state transition testing
- **DELETE /api/todos/:id** - Delete todo with proper cleanup verification

### Test File Structure

```
src/
└── controllers/
    └── todo-controller.int-spec.ts  # Integration tests for all API endpoints
```

### Example Test Output

```
TodoController API Response Shape Tests
  GET /api/todos
    ✓ should return correct response shape for getAllTodos
  GET /api/todos/:id
    ✓ should return correct response shape for getTodoById
  POST /api/todos
    ✓ should return correct response shape for createTodo
  PUT /api/todos/:id
    ✓ should return correct response shape for updateTodo
  DELETE /api/todos/:id
    ✓ should return correct response shape for deleteTodo

Test Suites: 1 passed, 1 total
Tests:       5 passed, 5 total
```

### Testing Features

- **Exact Response Matching**: Tests validate precise API response structures
- **Dynamic Test Data**: Creates and uses real todo items for testing
- **Error Scenario Testing**: Validates error responses and HTTP status codes
- **Business Logic Validation**: Tests todo state transitions and constraints
- **Type Safety**: Full TypeScript integration ensures type-safe test code

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm test` - Run automated tests with Jest (silent mode)
- `npm run test:watch` - Run tests in watch mode for development
- `npm run test:coverage` - Run tests with coverage report
- `npm run test:verbose` - Run tests with detailed output
- `npm run migrate` - Run database migrations for development
- `npm run migrate:test` - Run database migrations for test environment
- `npm run migrate:prod` - Run database migrations for production
- `npm run migrate:status` - Check migration status
- `npm run test:db` - Test database connection
- `npm run openapi:generate` - Generate OpenAPI documentation
- `npm run docs:generate` - Alias for OpenAPI generation
- `npm run logs` - View today's application logs in real-time
- `npm run logs:error` - View error logs (exceptions and rejections)
- `npm run logs:all` - View all log files in real-time
- `./test-validation.sh` - Test Zod validation scenarios (ensure server is running)

## Next Steps & Roadmap

### ✅ Completed Features

- [x] **Full CRUD operations for todos** - Complete PostgreSQL implementation with user isolation
- [x] **User authentication and authorization (JWT)** - Complete auth system with registration/login
- [x] **User profile management** - Update profile, change password, token verification
- [x] **Input validation with Zod** - Comprehensive request validation with schemas
- [x] **Type-safe validation middleware** with proper error handling
- [x] **Request body, parameters, and query validation**
- [x] **Advanced error handling system** - Structured error handling with ErrorCode enum
- [x] **Request/response logging middleware** - Comprehensive logging with Winston and Morgan
- [x] **Automated testing with Jest and Supertest** - Integration tests for API response validation
- [x] **PostgreSQL database integration** - Full PostgreSQL support with connection pooling
- [x] **Database migrations and seeding** - Automated migration system with tracking
- [x] **Environment-based configuration** - Separate databases for development, test, and production
- [x] **Auto-generated OpenAPI/Swagger documentation** - Generated from Zod schemas
- [x] **Multi-user todo system** - User-specific todos with proper authorization
- [x] **Comprehensive logging system** - Winston with daily rotation and request tracking
- [x] **Complete PostgreSQL Repository Pattern** - All CRUD operations migrated from in-memory to PostgreSQL
- [x] **JWT-based security** - Token generation, validation, and user session management
- [x] **Password security** - BCrypt hashing with configurable rounds
- [x] **Database schema management** - Users and todos tables with proper relationships
- [x] **API response standardization** - Consistent response formats with Zod validation
- [x] **Authentication middleware** - Protected routes with user context
- [x] **User registration and login** - Complete user account management
- [x] **Database connection pooling** - Efficient PostgreSQL connection management
- [x] **Environment isolation** - Complete separation of dev/test/prod environments

### 🚧 In Progress

- [ ] **Token blacklisting for logout** - Server-side token invalidation for enhanced security
- [ ] **Advanced user management** - Email verification, password reset, account recovery flows

### 📋 Planned Features

#### API Enhancements

- [ ] **Pagination for large datasets** - Implement offset/limit and cursor-based pagination
- [ ] **Advanced filtering and sorting** - Filter by date, status, user, with complex queries
- [ ] **Search functionality** - Full-text search across todo titles and descriptions
- [ ] **Bulk operations** - Bulk create, update, delete todos
- [ ] **API versioning** - Version management for backward compatibility

#### Todo Enhancement Features

- [ ] **Enhanced todo features** - Categories, tags, due dates, priorities, attachments
- [ ] **Todo sharing and collaboration** - Share todos between users, team workspaces
- [ ] **Recurring todos** - Support for recurring tasks and schedules
- [ ] **Todo templates** - Predefined todo templates for common tasks

#### Security & Performance

- [ ] **Rate limiting and request throttling** - Protect against abuse and DoS attacks
- [ ] **API key authentication** - Alternative auth method for service-to-service calls
- [ ] **Input sanitization** - XSS and injection protection
- [ ] **Caching strategy (Redis)** - Cache frequently accessed data
- [ ] **Database query optimization** - Indexes, query analysis, performance monitoring

#### DevOps & Production

- [ ] **Docker containerization** - Multi-stage builds for development and production
- [ ] **CI/CD pipeline** - Automated testing, building, and deployment
- [ ] **Health checks and metrics** - Application monitoring and observability
- [ ] **Load balancing** - Scale horizontally with multiple instances
- [ ] **Backup and disaster recovery** - Automated database backups

#### Advanced Features

- [ ] **Real-time updates** - WebSocket support for live todo updates
- [ ] **Notification system** - Email/push notifications for todo reminders
- [ ] **Mobile app integration** - REST API optimizations for mobile clients
- [ ] **Third-party integrations** - Calendar sync, Slack notifications, etc.
- [ ] **Analytics and reporting** - User activity, todo completion statistics

## Environment Variables

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production/test)
- `DB_HOST` - Database host (default: localhost)
- `DB_PORT` - Database port (default: 5432)
- `DB_NAME` - Database name (environment-specific)
- `DB_USER` - Database username
- `DB_PASSWORD` - Database password
- `DB_SSL` - Enable SSL for database connection
- `LOG_LEVEL` - Logging level (debug/info/error)
- `JWT_SECRET` - Secret key for JWT token signing
- `JWT_EXPIRES_IN` - JWT token expiration time (default: 24h)
- `JWT_REFRESH_SECRET` - Secret key for refresh tokens (optional)
- `BCRYPT_ROUNDS` - BCrypt hashing rounds (default: 12)

## Authentication & Security Features

The application implements a comprehensive JWT-based authentication system with enterprise-grade security features.

### Authentication Flow

1. **User Registration**: Create account with email, password, and profile information
2. **Login**: Authenticate with email/password, receive JWT token
3. **Token-based Access**: Include JWT token in Authorization header for protected routes
4. **Profile Management**: Update user information and change passwords
5. **Token Verification**: Validate token integrity and expiration
6. **Logout**: Token blacklisting for secure logout (if implemented)

### Security Features

#### Password Security
- **BCrypt Hashing**: Industry-standard password hashing with configurable rounds
- **Password Strength Requirements**: Minimum 8 characters, uppercase, lowercase, and numbers
- **Secure Password Changes**: Require current password verification for changes

#### JWT Token Management
- **Configurable Expiration**: Set token lifetime (default 24 hours)
- **Secret Key Protection**: Environment-based JWT secret configuration
- **Token Validation**: Comprehensive token verification middleware
- **Authorization Headers**: Standard Bearer token authentication

#### Data Protection
- **Input Validation**: Comprehensive Zod schema validation for all auth endpoints
- **SQL Injection Prevention**: Parameterized queries with PostgreSQL
- **XSS Protection**: Input sanitization and validation
- **CORS Configuration**: Controlled cross-origin resource sharing

#### User Data Management
- **Unique Email Constraints**: Database-level uniqueness enforcement
- **Profile Updates**: Secure user information modification
- **Data Validation**: Email format, name length, and type validation
- **Error Handling**: Secure error responses without information leakage

### Authentication Endpoints

#### Registration
```bash
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### Login
```bash
POST /api/auth/login
{
  "email": "user@example.com", 
  "password": "SecurePass123"
}
```

#### Profile Management
```bash
# Get current user profile
GET /api/auth/profile
Authorization: Bearer <jwt_token>

# Update profile
PUT /api/auth/profile  
Authorization: Bearer <jwt_token>
{
  "firstName": "Jane",
  "email": "jane@example.com"
}

# Change password
PUT /api/auth/change-password
Authorization: Bearer <jwt_token>
{
  "currentPassword": "OldPass123",
  "newPassword": "NewSecurePass456"
}
```

### Protected Route Access

All todo endpoints require authentication:

```bash
# Example authenticated request
curl -H "Authorization: Bearer <your_jwt_token>" \
     -H "Content-Type: application/json" \
     http://localhost:3000/api/todos
```

### User-Todo Relationship

- **User Isolation**: Each user can only access their own todos
- **Automatic Association**: New todos are automatically linked to the authenticated user
- **Database Constraints**: Foreign key relationships ensure data integrity
- **Authorization Checks**: Middleware verifies user ownership for all operations

## Environment Configuration Strategy

This project implements a comprehensive environment configuration system that provides complete isolation between development, test, and production environments.

### Environment Files Structure

```
.env                 # Base environment variables (shared across all environments)
.env.development     # Development-specific overrides
.env.test            # Test-specific overrides  
.env.production      # Production-specific overrides
```

### Automatic Environment Detection

The application automatically detects the current environment using `NODE_ENV` and loads the appropriate configuration files:

1. **Base Configuration**: Always loads `.env` first
2. **Environment-Specific**: Loads `.env.{NODE_ENV}` to override base settings
3. **Fallback Defaults**: Uses sensible defaults if environment variables are missing

### Environment-Specific Database Configuration

Each environment uses its own isolated database to prevent data contamination:

| Environment | Database Name | Pool Size | Timeouts | Logging |
|-------------|---------------|-----------|----------|---------|
| **Development** | `todo_list` | 20 connections | 30s | Full logging |
| **Test** | `todo_list_test` | 5 connections | 1s | Silent mode |
| **Production** | `todo_list_prod` | 50 connections | 30s | Error only |

### Environment Scripts

```bash
# Development environment
npm run dev                    # Start development server
npm run migrate               # Run development migrations

# Test environment  
npm run test                  # Run tests with test database
npm run test:db              # Test database connection
npm run migrate:test         # Run test database migrations

# Production environment
npm start                    # Start production server
npm run migrate:prod         # Run production migrations
```

### Environment Configuration Features

#### 1. **Database Isolation**
- Each environment uses a separate PostgreSQL database
- Prevents test data from contaminating development/production
- Independent schema migrations per environment

#### 2. **Connection Pool Optimization**
- **Test Environment**: Small pool (5 connections) for fast test execution
- **Development**: Medium pool (20 connections) for local development
- **Production**: Large pool (50 connections) for high concurrency

#### 3. **Logging Configuration**
- **Test**: Silent mode to reduce test output noise
- **Development**: Full debug logging for troubleshooting
- **Production**: Error-level logging for performance

#### 4. **Security Considerations**
- Production automatically enables SSL for database connections
- Environment files excluded from version control (`.gitignore`)
- Sensitive data (passwords) never logged in plain text

### Setting Up Environments

#### Development Setup
1. Create `.env` file with base configuration:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=todo_list
DB_USER=postgres
DB_PASSWORD=your_password
DB_SSL=false
NODE_ENV=development
PORT=3000
```

#### Test Environment Setup
1. Create `.env.test` file:
```env
DB_NAME=todo_list_test
NODE_ENV=test
PORT=3001
LOG_LEVEL=error
```

2. Create test database and run migrations:
```bash
npm run migrate:test
```

#### Production Deployment
1. Create `.env.production` file:
```env
DB_HOST=your-production-host
DB_NAME=todo_list_prod  
DB_SSL=true
NODE_ENV=production
LOG_LEVEL=info
```

2. Run production migrations:
```bash
npm run migrate:prod
```

### Environment Configuration Benefits

1. **Complete Isolation**: Each environment is completely isolated
2. **Type Safety**: Full TypeScript interfaces for configuration
3. **Flexible Overrides**: Easy to override any setting per environment
4. **Automatic Detection**: No manual configuration switching needed
5. **Performance Optimization**: Environment-specific optimizations
6. **Security**: Production-ready security defaults
7. **Developer Experience**: Simple commands for each environment

### Configuration Validation

The application validates database connections on startup and provides detailed error messages:

```bash
# Test database connection
npm run test:db

# Example output:
✅ Database connection successful!
┌──────────────┬─────────────────┐
│ (index)      │ Values          │
├──────────────┼─────────────────┤
│ Host         │ 'localhost'     │
│ Port         │ 5432            │
│ Database     │ 'todo_list'     │
│ User         │ 'postgres'      │
│ Password Set │ '✅ Yes'        │
│ SSL          │ false           │
└──────────────┴─────────────────┘
```

This robust environment system ensures reliable deployments and prevents configuration-related issues across different deployment stages.

## Database & Migration System

The application uses PostgreSQL with a comprehensive migration system that tracks and manages database schema changes across all environments.

### Database Features

- **PostgreSQL Integration**: Full PostgreSQL support with connection pooling
- **Migration Tracking**: Database-tracked migration system prevents duplicate executions
- **Environment Isolation**: Separate databases for development, test, and production
- **Automatic Schema Management**: SQL-based migrations with rollback safety
- **Sample Data Seeding**: Pre-populated test data for development

### Migration System

#### Migration Files Structure
```
migrations/
└── 001_create_todos_table.sql    # Initial todos table creation
```

#### Migration Commands
```bash
# Run migrations for different environments
npm run migrate              # Development database
npm run migrate:test        # Test database  
npm run migrate:prod        # Production database

# Check migration status
npm run migrate:status      # View executed and pending migrations
```

#### Migration Features

1. **Automatic Tracking**: Creates `migrations` table to track executed migrations
2. **Idempotent Operations**: Safe to run multiple times without duplicating changes
3. **Transaction Safety**: Each migration runs in a database transaction
4. **Ordered Execution**: Migrations execute in alphabetical/numeric order
5. **Detailed Logging**: Comprehensive logs of migration progress and errors

#### Sample Migration Output
```bash
✅ Loaded .env.development
✅ Database connection successful
✅ Migrations tracking table ensured
✅ Migration completed: 001_create_todos_table.sql
✅ All migrations completed successfully
```

### Database Schema

#### Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### Todos Table
```sql
CREATE TABLE todos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### Database Features
- **UUID Primary Keys**: Uses PostgreSQL's `gen_random_uuid()` for unique, secure IDs
- **Automatic Timestamps**: `created_at` and `updated_at` managed by database triggers
- **Foreign Key Relationships**: Todos linked to users with CASCADE delete
- **Performance Indexes**: Optimized queries on `email`, `user_id`, `completed`, and timestamp columns
- **Data Validation**: Database-level constraints ensure data integrity
- **Email Uniqueness**: Database-enforced unique constraint on user emails
- **User Data Protection**: Cascading deletes ensure no orphaned todos

### Database Setup Instructions

#### 1. Install PostgreSQL
```bash
# macOS with Homebrew
brew install postgresql
brew services start postgresql

# Create database user (if needed)
createuser -s postgres
```

#### 2. Create Databases
```bash
# Connect to PostgreSQL
psql postgres

# Create databases for each environment
CREATE DATABASE todo_list;          -- Development
CREATE DATABASE todo_list_test;     -- Testing  
CREATE DATABASE todo_list_prod;     -- Production
```

#### 3. Configure Environment Variables
Create appropriate `.env` files with database credentials (see Environment Configuration section above).

#### 4. Run Migrations
```bash
# Development environment
npm run migrate

# Test environment  
npm run migrate:test
```

#### 5. Verify Setup
```bash
# Test database connection
npm run test:db

# Start application
npm run dev
```

### Repository Pattern Implementation

The application implements a complete PostgreSQL integration following the Repository pattern:

#### Current Implementation Status
- ✅ **getAllTodos()** - Fully implemented with PostgreSQL async/await and user isolation
- ✅ **getTodoById()** - Complete PostgreSQL implementation with user authorization
- ✅ **createTodo()** - Full PostgreSQL integration with auto-generated UUIDs and timestamps
- ✅ **updateTodo()** - Complete update functionality with user ownership validation  
- ✅ **deleteTodo()** - Full delete implementation with user authorization checks

#### Database Integration Features
- **Connection Pooling**: Efficient database connection management with PostgreSQL pool
- **Error Handling**: Custom error types for database operations with structured logging
- **Logging Integration**: Comprehensive database operation logging with context
- **Type Safety**: Full TypeScript integration with database operations and data mapping
- **Data Mapping**: Automatic conversion between database rows and TypeScript objects
- **User Isolation**: All operations respect user ownership and authorization
- **UUID Primary Keys**: Secure, unique identifiers using PostgreSQL's gen_random_uuid()
- **Optimized Queries**: Indexed queries for performance on user_id, completed status, and timestamps

The migration from in-memory storage to PostgreSQL is now **complete** and maintains full API compatibility while adding enterprise-grade data persistence, user authorization, and multi-environment support.

## Architecture Benefits

- **Separation of Concerns** - Each layer has a single responsibility
- **Testability** - Easy to unit test individual layers
- **Maintainability** - Clear structure makes the code easy to understand and modify
- **Scalability** - Easy to add new features following the established patterns
- **Dependency Injection** - Loose coupling between components

### Dependency Injection Flow

```typescript
// In routes/todos.ts
const todoRepository = new TodoRepository();
const todoService = new TodoService(todoRepository);
const todoController = new TodoController(todoService);
```

This creates a clear dependency chain: `Controller → Service → Repository`

## API Response Strategy

This application implements a comprehensive API response strategy that ensures consistent, type-safe, and well-structured responses across all endpoints.

### Response Architecture

#### 1. **Consistent Response Format**
All API responses follow a standardized structure defined by TypeScript interfaces and Zod schemas:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
```

#### 2. **Schema-Driven Validation**
Every response is validated through Zod schemas to ensure runtime type safety:

```typescript
// Success response schema
export const TodoResponseSchema = z.object({
  success: z.boolean(),
  data: TodoSchema,
  message: z.string(),
});

// Error response schema
export const ErrorResponseSchema = z.object({
  success: z.boolean().default(false),
  error: z.string(),
  stack: z.string().optional(),
});
```

#### 3. **Type-Safe Response Generation**
Controllers use schema parsing to guarantee response structure consistency:

```typescript
const response = TodoResponseSchema.parse({
  success: true,
  data: TodoSchema.parse(todo),
  message: "Todo retrieved successfully",
});
res.json(response);
```

### Response Types

#### **Success Responses**

**Single Todo Response:**
```json
{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Learn TypeScript",
    "description": "Study TS fundamentals",
    "completed": false,
    "createdAt": "2025-01-15T10:30:00.000Z",
    "updatedAt": "2025-01-15T10:30:00.000Z"
  },
  "message": "Todo retrieved successfully"
}
```

**Multiple Todos Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "title": "Learn TypeScript",
      "description": "Study TS fundamentals",
      "completed": false,
      "createdAt": "2025-01-15T10:30:00.000Z",
      "updatedAt": "2025-01-15T10:30:00.000Z"
    }
  ],
  "message": "Todos retrieved successfully"
}
```

**Delete Operation Response:**
```json
{
  "success": true,
  "data": [],
  "message": "Todo deleted successfully"
}
```

#### **Error Responses**

The application provides detailed error responses with appropriate HTTP status codes:

**Validation Error (400):**
```json
{
  "success": false,
  "error": "Validation failed: body.title: Title is required"
}
```

**Resource Not Found (404):**
```json
{
  "success": false,
  "error": "Todo not found, id: 123e4567-e89b-12d3-a456-426614174000"
}
```

**Business Logic Error (400):**
```json
{
  "success": false,
  "error": "Cannot update completed todo"
}
```

**Database Error (500):**
```json
{
  "success": false,
  "error": "Database error occurred"
}
```

**Development Mode Enhancement:**
In development, error responses include stack traces for debugging:
```json
{
  "success": false,
  "error": "Todo not found",
  "stack": "Error: Todo not found\n    at TodoController.getTodo..."
}
```

### Response Strategy Features

#### 1. **Multi-Layer Validation**
- **Controller Level**: Response structure validation with Zod schemas
- **Data Level**: Individual todo validation against TodoSchema
- **Type Level**: TypeScript interfaces ensure compile-time safety

#### 2. **Error Code Mapping**
Structured error handling maps error types to appropriate HTTP status codes:
- `VALIDATION_ERROR` → 400 Bad Request
- `TODO_NOT_FOUND` → 404 Not Found
- `INVALID_TODO_STATE` → 400 Bad Request
- `DATABASE_ERROR` → 500 Internal Server Error

#### 3. **Consistent Message Strategy**
Each operation provides clear, actionable messages:
- **CRUD Operations**: Success messages indicate the action performed
- **Error Messages**: Specific error descriptions with context
- **Resource Identification**: Include relevant IDs in error messages

#### 4. **Response Parsing Pipeline**
Every response goes through a validation pipeline:
```typescript
// 1. Service returns raw data
const todoRaws = await this.todoService.getAllTodos();

// 2. Parse individual todos
const todos: Todo[] = z.array(TodoSchema).parse(
  todoRaws.map((todo) => TodoSchema.parse(todo))
);

// 3. Parse complete response
const response = TodosResponseSchema.parse({
  success: true,
  data: todos,
  message: "Todos retrieved successfully",
});

// 4. Send validated response
res.json(response);
```

### Benefits of This Strategy

1. **Runtime Safety**: Zod validation prevents malformed responses
2. **Type Safety**: Full TypeScript integration with compile-time checking
3. **Consistency**: All endpoints follow identical response patterns
4. **Debugging**: Development mode provides detailed error information
5. **API Contract**: Clear, documented response structures
6. **Error Handling**: Comprehensive error classification and mapping
7. **Maintainability**: Centralized response schema management

### Development Workflow

When adding new endpoints:
1. **Define Response Schema**: Create Zod schema for the response type
2. **Type Generation**: Use `z.infer<>` to generate TypeScript types
3. **Controller Implementation**: Use schema parsing for response validation
4. **Error Handling**: Map business errors to appropriate error codes
5. **Testing**: Validate response shapes in integration tests

This strategy ensures that all API responses are predictable, type-safe, and follow consistent patterns, making the API easier to consume and maintain.
