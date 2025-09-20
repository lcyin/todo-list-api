# Todo List API

A comprehensive RESTful API for managing todos and user authentication built with Express.js and TypeScript following clean architecture principles.

## Quick Start

1. Clone the repository:

   ```bash
   git clone <repo-url>
   cd todo-list-api
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

The server will run on `http://localhost:3000`

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Docker & Docker Compose

### Database Setup

You can quickly set up the PostgreSQL database using Docker Compose:

```bash
docker-compose up db
```

This will start the database container defined in `docker-compose.yml`.

For manual setup or more details, see [Postgres Setup](docs/postgres-setup.md) and [Postgres Migration](docs/postgres-migration.md).

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

## References

- [API Endpoints](docs/api-endpoints.md)
- [Authentication Strategy](docs/authentication-strategy.md)
- [Environment Variables](docs/environment-variables.md)
- [Error Handling Strategy](docs/error-handling-strategy.md)
- [Features](docs/features.md)
- [Input Validation](docs/input-validation.md)
- [Postgres Migration](docs/postgres-migration.md)
- [Postgres Setup](docs/postgres-setup.md)
- [Project Structures](docs/project-structures.md)
- [Testing Strategy](docs/testing-strategy.md)
- [Zod OpenAPI Guide](docs/zod-openapi-guide.md)