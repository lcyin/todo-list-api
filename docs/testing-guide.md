# Testing Guide

The application includes comprehensive testing setup with Jest and integration tests.

## Environment Setup

Before running tests, you need to configure the test environment by setting up environment files:

### 1. Create Test Environment File

The application automatically loads `.env.test` when `NODE_ENV=test`. Create a dedicated test environment file:

```bash
cp .env.example .env.test
```

You can also create a general `.env` file for development if needed:

```bash
cp .env.example .env.test
```

### 2. Configure Test Environment Variables

Edit the `.env.test` file with appropriate values for testing:

```bash
# Set to test environment
NODE_ENV=test
PORT=3001

# API Version
API_VERSION=v1

# Database Configuration (only needed if using postgres repository)
DB_HOST=localhost
DB_PORT=25434
DB_NAME=todolist_test
DB_USER=postgres
DB_PASSWORD=password
DB_SSL=false
DB_MAX_CONNECTIONS=5
```

### 3. Important Environment Considerations

- **Automatic Environment Loading**: The application automatically loads `.env.test` when `NODE_ENV=test`, ensuring test-specific configurations are isolated from development settings
- **NODE_ENV**: Set to `test` to ensure test-specific configurations are loaded
- **PORT**: Use a different port (e.g., 3001) to avoid conflicts with development server
- **REPOSITORY_TYPE**:
  - Use `memory` for fast, isolated tests that don't require database persistence
  - Use `postgres` for integration tests that need database functionality
- **DB_NAME**: Use a separate test database (e.g., `todolist_test`) to avoid data conflicts
- **DB_MAX_CONNECTIONS**: Lower value (e.g., 5) is sufficient for testing

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

## Test Structure

- **Integration Tests**: `src/__tests__/todos.integration.test.ts` - Test complete API endpoints
- **Health Check Tests**: `src/__tests__/health.test.ts` - Test health endpoints
- **Test Setup**: `src/test-setup.ts` - Common test configuration

## Test Environment

Tests use a separate test environment configuration and can be run independently of the development database.

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the project for production
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Run ESLint and check code formatting
- `npm run lint:fix` - Fix ESLint issues and format code
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run test:migrate` - Run database migrations from `src/db/migrations/` with test environment variables
