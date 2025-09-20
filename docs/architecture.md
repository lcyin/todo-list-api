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