# Copilot Guidelines for Todo List API

## Related Documentation

For comprehensive guidelines, also refer to:

- `rest-api-standard.instructions.md` - Core architectural principles and REST API design standards
- `typescript.instructions.md` - TypeScript performance optimization best practices
- `hexagonal-architecture.instructions.md` - Hexagonal architecture (ports and adapters) for TypeScript
- `jest-testing.instructions.md` - Testing strategies and best practices for TypeScript

## Coding Standards

### General Principles

- Follow RESTful API design patterns (see `rest-api-standard.instructions.md` for details)
- Use clear, descriptive variable and function names
- Write self-documenting code with minimal but meaningful comments
- Prefer composition over inheritance
- Use TypeScript for type safety

### Code Style

- Use 2 spaces for indentation
- Use camelCase for variables and functions
- Use PascalCase for classes and interfaces
- Use UPPER_SNAKE_CASE for constants
- Maximum line length: 100 characters

### API Design

- Use proper HTTP status codes (200, 201, 400, 404, 500, etc.)
- Include proper error handling and validation
- Use consistent naming conventions for endpoints
- Include pagination for list endpoints
- Add proper request/response typing

### Database

- Use descriptive table and column names
- Always include created_at and updated_at timestamps
- Use foreign key constraints where appropriate
- Include proper indexes for performance

### Security

- Always validate input data
- Use parameterized queries to prevent SQL injection
- Implement proper authentication and authorization
- Never expose sensitive data in error messages
- Use HTTPS for all endpoints

### Testing

- Write unit tests for all business logic
- Include integration tests for API endpoints
- Use descriptive test names that explain the scenario
- Mock external dependencies in tests
- Aim for high code coverage

### Dependencies

- Prefer well-maintained, popular packages
- Keep dependencies up to date
- Document any specific version requirements
- Use exact versions in package.json for production dependencies
