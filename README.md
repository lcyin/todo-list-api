# Todo List API

A comprehensive RESTful API for managing todos and user authentication built with Express.js and TypeScript following clean architecture principles.

## Local Setup

### Prerequisites

- Node.js and npm installed
- PostgreSQL installed and running

### Steps

1. Create a PostgreSQL database instance (default config):
   - Database: `todo_list`
   - User: `postgres`
   - Password: `password`
   - Host: `localhost`
   - Port: `5432`

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run database migrations:

   ```bash
   npm run migrate
   ```

4. Start the application:

   ```bash
   npm run dev
   ```

5. The API will be available at [http://localhost:3000](http://localhost:3000)

## Getting Started with Docker Compose

1. Ensure Docker is installed on your system.

2. Build and start the application:

   ```bash
   docker-compose up --build
   ```

3. The API will be available at [http://localhost:3000](http://localhost:3000)

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