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