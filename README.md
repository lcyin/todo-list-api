# Todo List API

A RESTful API for managing todo lists and tasks built with TypeScript, Express, and PostgreSQL following Hexagonal Architecture principles.

## 🏛️ Architecture Overview

This application implements **Hexagonal Architecture** (Ports & Adapters pattern) with the following key characteristics:

- **🔵 Primary Adapters**: REST Controllers handle HTTP requests
- **⬢ Core Domain**: Business logic with TodoService and domain entities
- **🟡 Secondary Adapters**: PostgreSQL repository for data persistence
- **🔌 Ports**: Clear interfaces between layers (ITodoService, ITodoRepository)
- **📦 Modular Services**: Component-based service architecture

For a detailed view of the hexagonal architecture used in this project, see the [Architecture Diagram](./diagrams/hexagonal-architecture.md).

## 🚀 Quick Start

### Prerequisites
- Node.js (v22 or higher)
- npm or yarn
- PostgreSQL (via Docker or local installation)

### Installation

#### Option 1: Quick Setup (Recommended)
```bash
git clone <repository-url>
cd todo-list-api
./scripts/setup.sh
```

#### Option 2: Manual Setup
1. Clone the repository:
```bash
git clone <repository-url>
cd todo-list-api
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start PostgreSQL database:
```bash
docker-compose up -d postgres
```

5. Run database migrations:
```bash
npm run migrate
```

6. Start development server:
```bash
npm run dev
```

7. Visit http://localhost:3000/health to verify the API is running

##  API Documentation

The API includes comprehensive Swagger/OpenAPI documentation:

- **Interactive Documentation**: <http://localhost:3000/api-docs>
- **JSON Specification**: <http://localhost:3000/api-docs.json>

### Quick API Overview

- **Health Checks**: `GET /health`, `GET /api/v1/health`
- **Todo Operations**: All CRUD operations under `/api/v1/todos`
- **Documentation**: Multiple formats for API documentation

## 📜 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the project for production
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Run ESLint and check code formatting
- `npm run lint:fix` - Fix ESLint issues and format code
- `npm run format` - Format code with Prettier
- `npm run migrate` - Run database migrations from `src/db/migrations/`

## 📖 Additional Documentation

For detailed information on specific topics, see the documentation in the `docs/` folder:

- **[Database Setup Guide](./docs/database-setup.md)** - PostgreSQL setup, migrations, and management
- **[Development Guide](./docs/development-guide.md)** - Development workflow, project structure, and environment setup
- **[Testing Guide](./docs/testing-guide.md)** - Test structure, running tests, and test environment
- **[API Documentation Guide](./docs/api-documentation.md)** - Detailed API documentation, endpoints, and deployment

## 🤝 Contributing

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.
