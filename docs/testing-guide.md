# Testing Guide

The application includes comprehensive testing setup with Jest and integration tests.

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
- `npm run migrate` - Run database migrations from `src/db/migrations/`
