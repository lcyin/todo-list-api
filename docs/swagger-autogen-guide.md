# Swagger-Autogen Setup

This project uses `swagger-autogen` to automatically generate Swagger/OpenAPI documentation from your code comments and route definitions.

## Overview

The Swagger documentation is automatically generated from:
- Controller methods and route definitions
- Predefined schema definitions
- JSDoc-style comments in your code

## Getting Started

### 1. Generate Swagger Documentation

To generate the swagger.json file:

```bash
npm run swagger:generate
```

This will:
- Scan your controllers and routes
- Generate a swagger.json file in the `swagger/` directory
- Include all your API endpoints with proper documentation

### 2. Development with Auto-Generation

For development with automatic swagger generation:

```bash
npm run dev:swagger
```

This will generate the swagger documentation and then start the dev server.

### 3. Watch Mode (Optional)

To automatically regenerate swagger documentation when your code changes:

```bash
npm run swagger:watch
```

## Available Scripts

- `npm run swagger:generate` - Generate swagger.json file
- `npm run swagger:watch` - Watch for changes and regenerate automatically
- `npm run dev:swagger` - Generate swagger and start dev server

## Accessing Documentation

Once the server is running, you can access:

- **Swagger UI**: http://localhost:3000/api-docs
- **Swagger JSON**: http://localhost:3000/api-docs.json

## Configuration

The swagger-autogen configuration is in `scripts/swagger-autogen.js`. It includes:

### Basic Information
- API title, version, and description
- Contact information and license
- Host and base path configuration

### Schema Definitions
Pre-defined schemas for:
- `Todo` - Complete todo object
- `CreateTodoRequest` - Request body for creating todos
- `UpdateTodoRequest` - Request body for updating todos
- `TodosResponse` - Paginated response for todo lists
- `HealthResponse` - Health check response
- `ErrorResponse` - Standard error response

### Endpoints
The script automatically generates documentation for:
- **Health endpoints**: `/health`, `/health/readiness`, `/health/liveness`
- **Todo endpoints**: `/todos` (GET, POST), `/todos/{id}` (GET, PUT, DELETE)

## Adding Documentation to Your Code

You can enhance the auto-generated documentation by adding JSDoc comments to your controllers:

```typescript
/**
 * GET /api/v1/todos - Get all todos with optional filtering and pagination
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
public getTodos = async (req: Request, res: Response): Promise<void> => {
  // Implementation
};
```

## Customizing Schemas

To modify the swagger schemas, edit the `definitions` section in `scripts/swagger-autogen.js`. The schemas use OpenAPI 2.0 specification format.

## File Structure

```
├── scripts/
│   └── swagger-autogen.js      # Swagger generation script
├── swagger/
│   └── swagger.json           # Generated swagger documentation (auto-generated)
├── src/
│   ├── config/
│   │   └── swagger-autogen.ts # Swagger configuration for app
│   └── ...
```

## Troubleshooting

### Swagger file not found
If you see "Swagger documentation file not found", run:
```bash
npm run swagger:generate
```

### Changes not reflected
If your changes aren't showing up:
1. Regenerate the swagger file: `npm run swagger:generate`
2. Restart the server: `npm run dev`

### Custom endpoints not showing
The swagger-autogen script includes manual path definitions for endpoints that couldn't be auto-detected. If you add new endpoints, you may need to update the `paths` section in the post-processing part of `scripts/swagger-autogen.js`.

## Benefits of This Setup

1. **Automatic Generation**: Documentation is generated from your actual code
2. **Always Up-to-Date**: No need to manually maintain separate documentation files
3. **Integrated Workflow**: Part of your development process
4. **Interactive**: Swagger UI allows testing endpoints directly
5. **Standards Compliant**: Generates valid OpenAPI/Swagger documentation

## Migration from swagger-jsdoc

This project was migrated from `swagger-jsdoc` to `swagger-autogen`. The benefits include:
- Better automatic endpoint detection
- Reduced manual configuration
- More consistent documentation generation
- Easier maintenance

The old swagger-jsdoc configuration files can be found in `src/config/swagger.ts` for reference, but the app now uses `src/config/swagger-autogen.ts`.
