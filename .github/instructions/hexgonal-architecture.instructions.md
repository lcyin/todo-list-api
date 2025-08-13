# Copilot Instructions: Hexagonal Architecture (Ports & Adapters) for TypeScript

## Overview

All code in this repository must follow the hexagonal architecture (ports and adapters pattern) using TypeScript best practices.

## Design Rules

### Core Domain Logic (Entities)

- Place all domain logic and business entities in the `domain/` folder
- No infrastructure or framework code (no Express, no database logic) in `domain/`

### Ports

- Define TypeScript interfaces for all inbound (driving) and outbound (driven) interactions:
  - **Inbound ports**: actions triggered by external actors (users, APIs)
  - **Outbound ports**: calls from the domain to external services (database, cache, APIs)
- Place port interfaces in `domain/ports/`

#### Port Interface Design

- **Inbound Ports (Use Cases)**: Define business operations with domain-specific parameters
- **Outbound Ports (Repositories)**: Define data access contracts using domain entities
- Use domain objects as parameters and return types, never framework-specific types

#### Example Port Interfaces

```typescript
// Inbound port - defines what the domain can do
export interface GetTodosUseCase {
  execute(queryParams: TodoQueryParams): Promise<PaginatedTodosResponse>;
}

// Outbound port - defines what the domain needs
export interface TodoRepository {
  findAll(filters: TodoFilters): Promise<{ todos: Todo[]; total: number }>;
  findById(id: string): Promise<Todo | null>;
}
```

### Adapters

- Implement adapters for all ports in `adapters/`:
  - `adapters/primary`: inbound adapters (e.g., REST controllers, CLI handlers)
  - `adapters/secondary`: outbound adapters (e.g., database, external API clients)
- Adapters implement port interfaces and convert to/from domain models
- Adapters depend on domain interfaces, not on domain entities or logic

### Dependency Rule

- Domain code (`domain/`) must not depend on any code from `adapters/` or specific frameworks
- Adapters may import from `domain/`, especially port interfaces

### Testing

- Write pure unit tests for the domain logic (no databases or frameworks)
- Use stub/mocked adapters when writing integration tests

## File Organization Example

```text
domain/
├── User.ts
├── OrderService.ts
└── ports/
    ├── UserRepository.ts         # outbound port (interface)
    └── CreateOrderUseCase.ts     # inbound port (interface)

adapters/
├── primary/
│   ├── RestOrderController.ts
│   └── CliOrderCommand.ts
└── secondary/
    ├── MongoUserRepository.ts
    └── HttpPaymentGateway.ts

services/
├── UnifiedOrderService.ts        # 🎯 Facade for all order operations
├── CreateOrderService.ts         # Individual use case services
├── GetOrderService.ts
└── UpdateOrderService.ts
```

## Implementation Benefits

1. **Technology Independence**: Domain logic is isolated from frameworks (Express, databases, etc.)
2. **Testability**: Pure domain logic can be tested without external dependencies
3. **Flexibility**: Easy to swap implementations (e.g., switch from in-memory to database storage)
4. **Maintainability**: Clear separation of concerns and dependency inversion
5. **Service Composition**: Facade pattern allows both unified and granular service access
6. **Client Simplification**: Unified services reduce complexity for primary adapters

## Dependency Flow Pattern

```
REST Controller → Unified Service Facade → Individual Use Cases → Domain Services → Repository Interface
     ↓                      ↓                       ↓                                        ↓
Primary Adapter    Service Composition    Use Case Services                        Secondary Adapter
     ↓                      ↓                       ↓                                        ↓
   Express            TodoService.ts         CreateTodoService.ts                   Storage Implementation
```

### Alternative Direct Flow (Granular Access)

```
REST Controller → Individual Use Case → Domain Services → Repository Interface
     ↓                      ↓                                        ↓
Primary Adapter    Use Case Service                        Secondary Adapter
     ↓                      ↓                                        ↓
   Express          CreateTodoService.ts                   Storage Implementation
```

## Domain Design Patterns

### Entities

- Encapsulate business rules and validation
- Immutable design with update methods returning new instances
- Pure domain logic without infrastructure concerns

### Value Objects

- Represent domain concepts with validation
- Immutable objects for requests, queries, and responses
- Handle business rule enforcement at the value level

### Use Case Services

- Implement specific business operations
- Coordinate between domain entities and repository interfaces
- Return domain objects, not framework-specific responses

### Service Composition & Facade Pattern

- **Individual Use Case Services**: Each implements a specific business operation (single responsibility)
- **Unified Service Facade**: Optional composition layer that combines multiple use cases
- **Facade Benefits**: Simplified client interface while maintaining individual service isolation

#### Facade Pattern Implementation

```typescript
// Unified service that composes individual use cases
export class TodoService {
  private readonly createTodoUseCase: CreateTodoUseCase;
  private readonly getTodosUseCase: GetTodosUseCase;
  private readonly getTodoByIdUseCase: GetTodoByIdUseCase;
  private readonly updateTodoUseCase: UpdateTodoUseCase;
  private readonly deleteTodoUseCase: DeleteTodoUseCase;

  constructor(private readonly todoRepository: ITodoRepository) {
    // Compose individual services
    this.createTodoUseCase = new CreateTodoService(this.todoRepository);
    this.getTodosUseCase = new GetTodosService(this.todoRepository);
    this.getTodoByIdUseCase = new GetTodoByIdService(this.todoRepository);
    this.updateTodoUseCase = new UpdateTodoService(this.todoRepository);
    this.deleteTodoUseCase = new DeleteTodoService(this.todoRepository);
  }

  // Delegate methods for convenience
  public async createTodo(data: CreateTodoData): Promise<Todo> {
    return await this.createTodoUseCase.execute(data);
  }

  public async getTodos(params: TodoQueryParams): Promise<PaginatedTodosResponse> {
    return await this.getTodosUseCase.execute(params);
  }
  // ... other delegate methods
}
```

## Coding Best Practices

- Maintain clean separation: core logic, ports, adapters
- Use dependency inversion at boundaries
- Use dependency injection to wire adapters to ports
- Keep domain models and services free from technical (infrastructure/framework) code

## Practical Implementation Example

### Dependency Injection in Routes

```typescript
// Wire up dependencies following hexagonal architecture

// Option 1: Using Unified Service Facade
const todoRepository = new InMemoryTodoRepository();
const todoService = new TodoService(todoRepository); // Facade composes all use cases
const todoController = new RestTodoController(todoService);

// Option 2: Using Individual Services (Granular)
const todoRepository = new InMemoryTodoRepository();
const getTodosUseCase = new GetTodosService(todoRepository);
const createTodoUseCase = new CreateTodoService(todoRepository);
const todoController = new RestTodoController(getTodosUseCase, createTodoUseCase);

// Use in routes with clean separation
router.get("/todos", todoController.getTodos);
```

### Service Facade vs Individual Services

**When to use Unified Service Facade:**

- Controllers need multiple related operations
- Want simplified dependency injection
- Prefer convenience over granular control

**When to use Individual Services:**

- Need fine-grained control over dependencies
- Want to minimize service dependencies
- Testing specific use cases in isolation

### Domain Entity Design

```typescript
export class Todo {
  constructor(
    public readonly id: string,
    public readonly title: string
    // ... other properties
  ) {
    this.validateTitle(); // Business rule enforcement
  }

  public update(updates: UpdateTodoRequest): Todo {
    return new Todo(/* new instance with updates */);
  }
}
```

### Use Case Implementation

```typescript
export class GetTodosService implements GetTodosUseCase {
  constructor(private readonly todoRepository: ITodoRepository) {}

  async execute(queryParams: TodoQueryParams): Promise<PaginatedTodosResponse> {
    // Pure business logic, no framework dependencies
    const { todos, total } = await this.todoRepository.findAll(/* ... */);
    return new PaginatedTodosResponse(todos /* pagination */);
  }
}
```

## Testing Strategy

1. **Domain Tests**: Test business logic in isolation without external dependencies
2. **Integration Tests**: Test use cases with stubbed/mocked adapters
3. **Adapter Tests**: Test individual adapters with mocked dependencies
4. **End-to-End Tests**: Test complete flows through the API
5. **Facade Tests**: Test service composition and delegation in unified services

### Example Domain Test

```typescript
describe("Todo Entity", () => {
  it("should enforce business rules", () => {
    expect(() => new Todo("1", "")).toThrow("Todo title cannot be empty");
  });
});
```

### Example Facade Test

```typescript
describe("TodoService Facade", () => {
  it("should delegate to individual use cases", async () => {
    const mockRepository = new MockTodoRepository();
    const todoService = new TodoService(mockRepository);

    const result = await todoService.createTodo({ title: "Test Todo" });

    expect(result).toBeDefined();
    expect(mockRepository.save).toHaveBeenCalled();
  });
});
```

_These guidelines ensure testability, maintainability, and adaptability. Strive for a loosely-coupled, technology-independent core._

## Common Anti-Patterns to Avoid

### ❌ Don't Do

```typescript
// Domain service depending on Express types
export class TodoService {
  async getTodos(req: Request): Promise<Response> {
    /* ... */
  }
}

// Use case returning framework-specific objects
export class GetTodosUseCase {
  async execute(): Promise<Express.Response> {
    /* ... */
  }
}

// Domain entity with database logic
export class Todo {
  async save(): Promise<void> {
    await database.save(this); // ❌ Infrastructure in domain
  }
}
```

### ✅ Do This Instead

```typescript
// Pure domain service with domain types
export class GetTodosService implements GetTodosUseCase {
  async execute(params: TodoQueryParams): Promise<PaginatedTodosResponse> {
    // Pure business logic
  }
}

// Unified service facade for convenience
export class TodoService {
  constructor(private readonly todoRepository: ITodoRepository) {
    // Compose individual services
  }

  async createTodo(data: CreateTodoData): Promise<Todo> {
    return await this.createTodoUseCase.execute(data);
  }
}

// Controller handling framework concerns
export class RestTodoController {
  constructor(private readonly todoService: TodoService) {} // Using facade

  async getTodos(req: Request, res: Response): Promise<void> {
    const params = new TodoQueryParams(req.query);
    const result = await this.todoService.getTodos(params);
    res.json(result.toPlainObject());
  }
}
```

---

**Apply these architecture guidelines to all files (`applyTo: "**"`) in the repository.\*\*

---

## Further Reading

- Hexagonal Architecture (Ports & Adapters) concepts for TypeScript
- Community articles and examples for Node.js/TypeScript hexagonal structures
