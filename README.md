# Todo List API

A RESTful API for managing todos built with Express.js and TypeScript following clean architecture principles.

## Features

- ✅ Full CRUD operations for todos
- 🏗️ Layered architecture (Controller → Service → Repository)
- 🔒 Security middleware (Helmet)
- 🌐 CORS enabled
- 📝 Request logging with Morgan
- 🛡️ **Comprehensive error handling system**
- ⚠️ **Structured error types with ErrorCode enum**
- 🎯 **Custom error interfaces and detailed error responses**
- ✨ **Input validation with Zod**
- 📊 TypeScript for type safety
- 🚀 Hot reload with Nodemon
- 🔄 Dependency injection pattern

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

### Todos
- `GET /api/todos` - Get all todos
- `GET /api/todos/:id` - Get todo by ID
- `POST /api/todos` - Create new todo
- `PUT /api/todos/:id` - Update todo
- `DELETE /api/todos/:id` - Delete todo

### Example Requests

#### Create Todo
```bash
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "Learn TypeScript", "description": "Study TS fundamentals"}'
```

#### Get All Todos
```bash
curl http://localhost:3000/api/todos
```

#### Update Todo
```bash
curl -X PUT http://localhost:3000/api/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'
```

## Project Structure

```
src/
├── app.ts                     # Main application file
├── controllers/               # Request handlers (HTTP layer)
│   └── todo-controller.ts
├── services/                  # Business logic layer
│   └── todo-service.ts
├── repositories/              # Data access layer
│   └── todo-repository.ts
├── middleware/                # Custom middleware
│   ├── errorHandler.ts        # Centralized error handling middleware
│   ├── validation.ts          # Zod validation middleware
│   ├── enums/                 # Error classification enums
│   │   └── error-code.enum.ts # Centralized error codes
│   ├── exceptions/            # Custom exception classes (empty)
│   └── interfaces/            # Error-related interfaces
│       └── errore-interface.ts # Error details interface
├── routes/                    # Route definitions
│   └── todos.ts
├── schemas/                   # Zod validation schemas
│   └── todo.schema.ts
├── types/                     # TypeScript type definitions
│   └── todo-route.ts
└── interfaces/                # TypeScript interfaces (empty)
```

### Architecture

This project follows a **layered architecture** pattern with **input validation** and **structured error handling**:

1. **Controllers** - Handle HTTP requests and responses, throw structured errors
2. **Services** - Contain business logic, validate business rules
3. **Repositories** - Manage data access and storage
4. **Middleware** - Handle validation, centralized error handling, and security
5. **Schemas** - Define input validation rules with Zod
6. **Types/Interfaces** - Define TypeScript contracts
7. **Error Management** - Centralized error codes, custom error interfaces, and structured error responses

## Sample Data

The application comes with pre-loaded sample todos for testing:

1. **Learn Node.js** - Study Node.js fundamentals (incomplete)
2. **Build a REST API** - Use Express.js to create a robust API (complete)

## Development Guidelines

When adding new features:

1. **Create types** in `src/types/` for any new data structures
2. **Define validation schemas** in `src/schemas/` using Zod
3. **Add repository methods** in `src/repositories/` for data access
4. **Implement business logic** in `src/services/`
5. **Create controller methods** in `src/controllers/` for HTTP handling
6. **Define routes** in `src/routes/` with validation middleware and wire up dependencies

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

## Error Handling System

The application implements a comprehensive error handling system with structured error management:

### Error Architecture

#### 1. **Custom Error Interface**
```typescript
export interface CustomError extends Error {
  statusCode?: number;
  type: ErrorCode;
  details?: ErrorDetails[];
}
```

#### 2. **Error Codes Enum**
Centralized error classification system:
- `VALIDATION_ERROR` - Input validation failures
- `TODO_NOT_FOUND` - Resource not found errors
- `INVALID_TODO_STATE` - Business logic violations
- `DATABASE_ERROR` - Data persistence issues
- `INTERNAL_SERVER_ERROR` - Unexpected system errors

#### 3. **Error Details Interface**
Provides structured error information:
```typescript
export interface ErrorDetails {
  field?: string;
  value?: any;
  constraint?: string;
  code?: string;
}
```

### Error Handling Flow

1. **Error Generation**: Controllers and services throw structured errors with specific ErrorCode types
2. **Error Middleware**: Centralized error handler processes all errors
3. **Response Mapping**: Each error type maps to appropriate HTTP status codes
4. **Logging**: Comprehensive error logging with context information
5. **Client Response**: Consistent error response format

### Error Response Examples

#### Validation Error (400)
```json
{
  "success": false,
  "error": "Validation failed: body.title: Title is required"
}
```

#### Resource Not Found (404)
```json
{
  "success": false,
  "error": "Todo not found, id: 123e4567-e89b-12d3-a456-426614174000"
}
```

#### Business Logic Error (400)
```json
{
  "success": false,
  "error": "Cannot update completed todo"
}
```

#### Database Error (500)
```json
{
  "success": false,
  "error": "Database error occurred"
}
```

### Development Error Features

In development mode, error responses include stack traces for debugging:
```json
{
  "success": false,
  "error": "Todo not found",
  "stack": "Error: Todo not found\n    at TodoController.getTodo..."
}
```

### Error Logging

The error handler logs detailed error information:
- Error type and message
- Request URL and HTTP method
- Timestamp
- Stack trace
- Additional error details

This information helps with debugging and monitoring application health.

## Testing

Currently, the project has placeholder tests. To add proper testing:

1. Install testing framework: `npm install --save-dev jest @types/jest supertest @types/supertest`
2. Create `__tests__` directories in each layer
3. Write unit tests for services and repositories
4. Write integration tests for controllers and routes

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm test` - Run tests (placeholder)
- `npm run logs` - View today's application logs in real-time
- `npm run logs:error` - View error logs (exceptions and rejections)
- `npm run logs:all` - View all log files in real-time
- `./test-validation.sh` - Test Zod validation scenarios (ensure server is running)

## Next Steps & Roadmap

### ✅ Completed Features
- [x] **Input validation with Zod** - Comprehensive request validation with schemas
- [x] Type-safe validation middleware with proper error handling
- [x] Request body, parameters, and query validation

### Immediate Improvements
- [x] **Implement proper error types and custom exceptions** - Structured error handling with ErrorCode enum and CustomError interface
- [x] **Add request/response logging middleware** - Comprehensive logging with Winston, request tracking, and structured logs
- [ ] Set up automated testing (Jest/Mocha)

### Database Integration
- [ ] Replace in-memory storage with MongoDB or PostgreSQL
- [ ] Add database migrations and seeding
- [ ] Implement connection pooling and error handling

### Advanced Features
- [ ] Add authentication and authorization (JWT)
- [ ] Implement pagination for large datasets
- [ ] Add filtering and sorting capabilities
- [ ] Create API documentation with Swagger/OpenAPI
- [ ] Add rate limiting and request throttling
- [ ] Implement caching strategy (Redis)

### DevOps & Production
- [ ] Add Docker containerization
- [ ] Set up CI/CD pipeline
- [ ] Add monitoring and logging (Winston, Morgan)
- [ ] Implement health checks and metrics
- [ ] Add environment-specific configurations

## Environment Variables

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)

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

## API Response Format

All API responses follow a consistent format:

```typescript
{
  "success": boolean,
  "data": T | null,
  "message": string,
  "error"?: string
}
```

### Sample Responses

**Success Response:**
```json
{
  "success": true,
  "data": [...],
  "message": "Todos retrieved successfully"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Todo not found"
}
```
