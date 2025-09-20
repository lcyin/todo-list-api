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
