# Development Guide

## Development Workflow

### Getting Started

1. **Clone and Setup**:

```bash
git clone <repository-url>
cd todo-list-api
./scripts/setup.sh
```

2. **Start Development Environment**:

```bash
# Start database
docker-compose up -d postgres

# Run migrations
npm run migrate

# Start development server
npm run dev
```

3. **Verify Setup**:

- Health check: http://localhost:3000/health
- API documentation: http://localhost:3000/api-docs
- Example API call: http://localhost:3000/api/v1/todos

### Code Quality

```bash
# Check code formatting and linting
npm run lint

# Auto-fix formatting and linting issues
npm run lint:fix

# Format code only
npm run format
```

### Building and Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Project Structure

```text
src/
├── adapters/                  # Hexagonal architecture adapters
│   └── repositories/         # Secondary adapters (data persistence)
│       └── todoRepository.ts # PostgreSQL repository implementation
├── controllers/              # Primary adapters (HTTP request handlers)
│   ├── todoController.ts    # Todo CRUD operations
│   └── healthController.ts  # Health check endpoints
├── domain/                   # Core business logic and entities
│   ├── Todo.ts              # Domain entity
│   ├── TodoValueObjects.ts  # Value objects and DTOs
│   └── ports/               # Interfaces (contracts)
│       └── TodoPorts.ts     # Service and repository interfaces
├── services/                 # Application services (use cases)
│   ├── TodoService.ts       # Unified service facade
│   └── components/          # Individual service components
│       ├── create-todos.component.ts
│       ├── get-todos.component.ts
│       ├── get-todo-by-id.component.ts
│       ├── update-todos.component.ts
│       └── delete-todo.component.ts
├── routes/                   # API route definitions
│   ├── index.ts             # Route aggregation
│   ├── todoRoutes.ts        # Todo endpoints
│   └── healthRoutes.ts      # Health check routes
├── config/                   # Configuration files
│   ├── index.ts             # Environment configuration
│   └── swagger.ts           # API documentation config
├── db/                       # Database setup and migrations
│   ├── index.ts             # PostgreSQL connection
│   └── migrations/          # SQL migration files
├── __tests__/               # Test files
│   ├── health.test.ts
│   └── todos.integration.test.ts
├── app.ts                    # Express application setup
├── index.ts                  # Application entry point
└── test-setup.ts            # Test configuration
```

## Environment Variables

Required environment variables (see `.env.example`):

```bash
NODE_ENV=development
PORT=3000
API_VERSION=v1

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=todolist
DB_USER=postgres
DB_PASSWORD=password
DB_SSL=false
DB_MAX_CONNECTIONS=10
```
