# Testing Guidelines

## Testing Philosophy

Our testing strategy emphasizes **comprehensive validation** and **maintainable test code**. We write tests that are explicit about expected behavior and resilient to changes.

## Testing Style Guide

### 1. Monolithic Assertions

Use single comprehensive assertions that validate the complete response structure rather than multiple small assertions.

**✅ Preferred:**

```typescript
expect(body).toEqual({
  todos: [
    {
      id: "1",
      title: "Learn TypeScript",
      description: "Study TypeScript fundamentals",
      completed: false,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    },
  ],
  pagination: {
    page: expect.any(Number),
    limit: expect.any(Number),
    total: expect.any(Number),
    totalPages: expect.any(Number),
    hasNext: expect.any(Boolean),
    hasPrevious: expect.any(Boolean),
  },
});
```

**❌ Avoid:**

```typescript
expect(response.body).toHaveProperty("todos");
expect(response.body.todos).toHaveLength(1);
expect(response.body.todos[0].id).toBe("1");
expect(response.body.todos[0].title).toBe("Learn TypeScript");
// ... multiple small assertions
```

### 2. Inline Expected Data

Define expected data directly within test assertions rather than using separate variables or helper functions.

**✅ Preferred:**

```typescript
it("should return specific todo with complete structure", async () => {
  const { body } = await request(app).get("/api/v1/todos/1").expect(200);

  expect(body).toEqual({
    id: "1",
    title: "Learn TypeScript",
    description: "Study TypeScript fundamentals",
    completed: false,
    createdAt: expect.any(String),
    updatedAt: expect.any(String),
  });
});
```

**❌ Avoid:**

```typescript
const expectedTodo = {
  id: "1",
  title: "Learn TypeScript",
  // ...
};

it("should return specific todo", async () => {
  const { body } = await request(app).get("/api/v1/todos/1").expect(200);
  expect(body).toEqual(expectedTodo);
});
```

### 3. Mixed Exact Values and Type Matchers

Combine exact value matching for known data with Jest matchers for dynamic fields.

**Key Patterns:**

- `expect.any(String)` for timestamps and dynamic string fields
- `expect.any(Number)` for calculated numbers like pagination totals
- `expect.any(Boolean)` for computed boolean values
- `expect.arrayContaining([...])` for arrays with specific items
- `expect.objectContaining({...})` for partial object matching

**Example:**

```typescript
expect(body).toEqual({
  todos: expect.arrayContaining([
    expect.objectContaining({
      id: expect.any(String),
      title: expect.any(String),
      completed: false, // Exact value when filtering
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    }),
  ]),
  pagination: {
    page: 1, // Exact value when specified in query
    limit: expect.any(Number),
    total: expect.any(Number),
    hasNext: expect.any(Boolean),
    hasPrevious: expect.any(Boolean),
  },
});
```

### 4. Comprehensive Test Coverage

Each test should validate both structure and content in a single assertion.

**Test Categories:**

1. **Basic Functionality**: Test the happy path with complete expected data
2. **Query Parameters**: Test parameter handling with expected values
3. **Error Handling**: Test error responses with complete error structure
4. **Edge Cases**: Test boundary conditions and unusual inputs

### 5. Test Naming Conventions

Use descriptive test names that explain both the action and expected result:

**Pattern:** `should [action] and [expected result]`

**Examples:**

- `should return specific todo with complete structure when ID exists`
- `should handle page parameter and return correct pagination`
- `should return 404 error for non-existent numeric ID`

### 6. Test Organization

```typescript
describe("API Endpoint", () => {
  describe("Basic functionality", () => {
    // Happy path tests
  });

  describe("Query parameters", () => {
    // Parameter handling tests
  });

  describe("Error handling", () => {
    // Error condition tests
  });

  describe("Edge cases", () => {
    // Boundary and unusual input tests
  });
});
```

## Integration Testing Strategy

### API Response Validation

Our integration tests validate:

1. **HTTP Status Codes**: Ensure correct status codes are returned
2. **Response Structure**: Complete object structure matches expectations
3. **Data Content**: Actual data values match expected business logic
4. **Type Safety**: All fields have correct data types

### Test Data Management

- **Seed Data**: Use consistent, well-known test data
- **Inline Expectations**: Define expected results directly in tests
- **Data Isolation**: Each test should be independent of others

### Error Testing

Test error conditions with complete error response validation:

```typescript
expect(body).toEqual({
  error: {
    code: "TODO_NOT_FOUND",
    message: "Todo with id '999' not found",
  },
});
```

## Best Practices

1. **Be Explicit**: Tests should clearly show what is expected
2. **Test Structure and Content**: Validate both response shape and data
3. **Use Descriptive Names**: Test names should explain the scenario
4. **Single Responsibility**: Each test should focus on one specific behavior
5. **Maintainable**: Tests should be easy to update when requirements change

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test todos.integration.test.ts
```

## Test File Structure

```text
src/
  __tests__/
    *.integration.test.ts  # API integration tests
    *.test.ts             # Unit tests
```

Integration tests should focus on complete API behavior, while unit tests should focus on individual function logic.
