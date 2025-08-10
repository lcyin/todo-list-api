# Hexagonal Architecture Diagram

This diagram illustrates the hexagonal architecture (ports and adapters pattern) used in the Todo List API project.

## Architecture Overview

```mermaid
graph TB
    %% External Actors
    Client[🌐 HTTP Client<br/>Web/Mobile App]
    TestRunner[🧪 Test Runner<br/>Jest Tests]
    
    %% Primary Adapters (Driving Side)
    subgraph Primary["🔵 Primary Adapters (Driving)"]
        RestController[📡 RestTodoController<br/>HTTP/REST Interface]
        HealthController[💓 HealthController<br/>Health Check Interface]
    end
    
    %% Application Core (Hexagon Center)
    subgraph Core["⬢ Application Core"]
        subgraph Ports["🔌 Ports (Interfaces)"]
            InboundPorts[📥 Inbound Ports<br/>• GetTodosUseCase<br/>• CreateTodoUseCase<br/>• UpdateTodoUseCase<br/>• DeleteTodoUseCase<br/>• GetTodoByIdUseCase]
            OutboundPorts[📤 Outbound Ports<br/>• TodoRepository]
        end
        
        subgraph Domain["🏛️ Domain Layer"]
            Entities[📦 Domain Entities<br/>• Todo<br/>• TodoValueObjects<br/>• TodoQueryParams<br/>• PaginatedTodosResponse]
        end
        
        subgraph Services["⚙️ Application Services"]
            GetTodosService[📋 GetTodosService]
            CreateTodoService[➕ CreateTodoService]
            UpdateTodoService[✏️ UpdateTodoService]
            DeleteTodoService[🗑️ DeleteTodoService]
            GetTodoByIdService[🔍 GetTodoByIdService]
        end
    end
    
    %% Secondary Adapters (Driven Side)
    subgraph Secondary["🟡 Secondary Adapters (Driven)"]
        InMemoryRepo[💾 InMemoryTodoRepository<br/>Data Persistence]
        %% Future adapters (commented for reference)
        %% DatabaseRepo[🗃️ DatabaseTodoRepository<br/>PostgreSQL/MongoDB]
        %% ExternalAPI[🌐 ExternalAPIAdapter<br/>Third-party Services]
    end
    
    %% External Infrastructure
    Database[(🗄️ Database<br/>PostgreSQL/MongoDB<br/>(Future))]
    ExternalServices[🔗 External Services<br/>Email/Notifications<br/>(Future)]
    
    %% Client connections to Primary Adapters
    Client --> RestController
    TestRunner --> RestController
    Client --> HealthController
    TestRunner --> HealthController
    
    %% Primary Adapters to Core
    RestController --> InboundPorts
    HealthController --> InboundPorts
    
    %% Core internal connections
    InboundPorts --> Services
    Services --> Domain
    Services --> OutboundPorts
    
    %% Core to Secondary Adapters
    OutboundPorts --> InMemoryRepo
    %% OutboundPorts --> DatabaseRepo
    %% OutboundPorts --> ExternalAPI
    
    %% Secondary Adapters to External Infrastructure
    InMemoryRepo -.-> Database
    %% DatabaseRepo --> Database
    %% ExternalAPI --> ExternalServices
    
    %% Styling
    classDef primaryAdapter fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    classDef secondaryAdapter fill:#fff3e0,stroke:#e65100,stroke-width:2px
    classDef core fill:#f3e5f5,stroke:#4a148c,stroke-width:3px
    classDef external fill:#e8f5e8,stroke:#2e7d32,stroke-width:2px
    classDef future fill:#fafafa,stroke:#9e9e9e,stroke-width:1px,stroke-dasharray: 5 5
    
    class RestController,HealthController primaryAdapter
    class InMemoryRepo secondaryAdapter
    class Core,Ports,Domain,Services core
    class Client,TestRunner,Database,ExternalServices external
```

## Architecture Components

### 🔵 Primary Adapters (Driving Side)

These adapters drive the application and handle incoming requests:

- **RestTodoController** (`src/adapters/primary/RestTodoController.ts`)
  - Handles HTTP/REST API requests
  - Converts HTTP requests to domain operations
  - Returns HTTP responses

- **HealthController** (`src/controllers/healthController.ts`)
  - Provides health check endpoints
  - Monitors application status

### ⬢ Application Core (The Hexagon)

#### 🔌 Ports (Interfaces)

Define contracts between the core and adapters:

**Inbound Ports** (`src/domain/ports/TodoPorts.ts`):

- `GetTodosUseCase` - Retrieve todos with filtering/pagination
- `CreateTodoUseCase` - Create new todos
- `UpdateTodoUseCase` - Update existing todos
- `DeleteTodoUseCase` - Delete todos
- `GetTodoByIdUseCase` - Retrieve single todo by ID

**Outbound Ports** (`src/domain/ports/TodoPorts.ts`):

- `TodoRepository` - Data persistence interface

#### 🏛️ Domain Layer

Contains core business entities and value objects:

- **Todo** (`src/domain/Todo.ts`) - Core todo entity
- **TodoValueObjects** (`src/domain/TodoValueObjects.ts`) - Value objects for data transfer
- **TodoQueryParams** - Query parameter handling
- **PaginatedTodosResponse** - Paginated response structure

#### ⚙️ Application Services

Implement business logic and use cases:

- **GetTodosService** (`src/services/GetTodosService.ts`)
- **CreateTodoService** (`src/services/CreateTodoService.ts`)
- **UpdateTodoService** (`src/services/UpdateTodoService.ts`)
- **DeleteTodoService** (`src/services/DeleteTodoService.ts`)
- **GetTodoByIdService** (`src/services/GetTodoByIdService.ts`)

### 🟡 Secondary Adapters (Driven Side)

These adapters are driven by the application core:

- **InMemoryTodoRepository** (`src/adapters/secondary/InMemoryTodoRepository.ts`)
  - Implements `TodoRepository` interface
  - Provides in-memory data persistence
  - Can be easily replaced with database implementations

## Architecture Principles

### Benefits of Hexagonal Architecture

1. **🔄 Dependency Inversion**
   - Core domain doesn't depend on external frameworks
   - Dependencies point inward toward the domain

2. **🧪 Testability**
   - Business logic can be tested in isolation
   - Easy to mock external dependencies
   - Fast unit tests without infrastructure

3. **🔌 Pluggability**
   - Easy to swap adapter implementations
   - Switch from in-memory to database without changing core logic
   - Add new adapters (GraphQL, gRPC, etc.) without core changes

4. **📦 Separation of Concerns**
   - Clear boundaries between layers
   - Each component has a single responsibility
   - Loose coupling between components

5. **🛡️ Framework Independence**
   - Core logic is independent of Express, databases, etc.
   - Can switch frameworks without rewriting business logic

### Layer Responsibilities

- **Primary Adapters**: Handle external requests (HTTP, CLI, tests)
- **Core Domain**: Contains business logic, entities, and use cases
- **Secondary Adapters**: Implement infrastructure concerns (persistence, external APIs)
- **Ports**: Define interfaces/contracts between layers

### Data Flow

1. **Inbound Flow**: Client → Primary Adapter → Inbound Port → Service → Domain
2. **Outbound Flow**: Service → Outbound Port → Secondary Adapter → External System

### Future Extensions

The architecture supports easy extension with:

- **Database Adapters**: PostgreSQL, MongoDB, etc.
- **External Service Adapters**: Email services, notification systems
- **Additional Primary Adapters**: GraphQL, gRPC, CLI interfaces
- **Event-driven Components**: Message queues, event stores

## File Structure Mapping

```text
src/
├── adapters/
│   ├── primary/          # 🔵 Primary Adapters
│   │   └── RestTodoController.ts
│   └── secondary/        # 🟡 Secondary Adapters
│       └── InMemoryTodoRepository.ts
├── domain/               # ⬢ Core Domain
│   ├── ports/           # 🔌 Ports (Interfaces)
│   │   └── TodoPorts.ts
│   ├── Todo.ts          # 📦 Domain Entities
│   └── TodoValueObjects.ts
├── services/            # ⚙️ Application Services
│   ├── GetTodosService.ts
│   ├── CreateTodoService.ts
│   ├── UpdateTodoService.ts
│   ├── DeleteTodoService.ts
│   └── GetTodoByIdService.ts
└── controllers/         # Additional Controllers
    └── healthController.ts
```
