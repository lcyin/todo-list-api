# Using Zod to Automatically Generate OpenAPI/Swagger Documentation

This guide explains how to use Zod schemas to automatically generate OpenAPI (Swagger) documentation for your API.

## Overview

Using Zod with OpenAPI provides several benefits:
- **Single Source of Truth**: Your validation schemas and API documentation stay in sync
- **Type Safety**: TypeScript types are automatically inferred from Zod schemas
- **Automatic Generation**: API documentation is generated from your existing validation code
- **Runtime Validation**: The same schemas validate requests at runtime

## Setup

### 1. Install Dependencies

```bash
npm install @asteasolutions/zod-to-openapi swagger-ui-express
npm install --save-dev @types/swagger-ui-express
```

### 2. Extend Zod with OpenAPI

In your schema files, extend Zod with OpenAPI functionality:

```typescript
import { z } from "zod";
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';

// Extend Zod with OpenAPI functionality
extendZodWithOpenApi(z);
```

### 3. Define Schemas with OpenAPI Metadata

Add OpenAPI metadata to your Zod schemas:

```typescript
export const UserSchema = z.object({
  id: z.uuid().openapi({ 
    description: 'Unique identifier for the user', 
    example: '123e4567-e89b-12d3-a456-426614174000' 
  }),
  email: z.string().email().openapi({ 
    description: 'User email address', 
    example: 'john.doe@example.com' 
  }),
  firstName: z.string().min(1).max(100).openapi({ 
    description: 'User first name', 
    example: 'John' 
  }),
  lastName: z.string().min(1).max(100).openapi({ 
    description: 'User last name', 
    example: 'Doe' 
  }),
}).openapi({ 
  title: 'User', 
  description: 'User information without password' 
});
```

## Project Structure

```
src/
├── config/
│   ├── openapi.ts                 # OpenAPI configuration
│   └── openapi-routes.ts          # Route definitions
├── schemas/
│   ├── auth.schema.ts             # Authentication schemas
│   └── todos.schema.ts            # Todo schemas
├── scripts/
│   └── generate-openapi.ts        # OpenAPI generation script
└── app.ts                         # Express app with Swagger UI
```

## Key Files

### OpenAPI Configuration (`src/config/openapi.ts`)

```typescript
import { OpenAPIRegistry, OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import { registerAuthRoutes, registerTodoRoutes } from './openapi-routes';

// Create the registry
export const registry = new OpenAPIRegistry();

// Define security schemes
registry.registerComponent('securitySchemes', 'bearerAuth', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
});

// Register all routes
registerAuthRoutes(registry);
registerTodoRoutes(registry);

// Generate the OpenAPI document
export function generateOpenAPIDocument() {
  const generator = new OpenApiGeneratorV3(registry.definitions);
  
  return generator.generateDocument({
    openapi: '3.0.0',
    info: {
      version: '1.0.0',
      title: 'Todo List API',
      description: 'A RESTful API for managing todo items',
    },
    servers: [
      { url: 'http://localhost:3000', description: 'Development' },
    ],
    tags: [
      { name: 'Authentication', description: 'User authentication' },
      { name: 'Todos', description: 'Todo management' },
    ],
  });
}
```

### Route Definitions (`src/config/openapi-routes.ts`)

```typescript
export function registerAuthRoutes(registry: OpenAPIRegistry) {
  // Register schemas
  registry.register('User', UserSchema);
  registry.register('AuthResponse', AuthResponseSchema);
  
  // Register endpoints
  registry.registerPath({
    method: 'post',
    path: '/auth/register',
    description: 'Register a new user',
    summary: 'User Registration',
    tags: ['Authentication'],
    request: {
      body: {
        content: {
          'application/json': {
            schema: registerSchema.shape.body,
          },
        },
      },
    },
    responses: {
      201: {
        description: 'User registered successfully',
        content: {
          'application/json': {
            schema: AuthResponseSchema,
          },
        },
      },
      400: {
        description: 'Bad request',
        content: {
          'application/json': {
            schema: ErrorResponseSchema,
          },
        },
      },
    },
  });
}
```

### Swagger UI Integration (`src/app.ts`)

```typescript
import swaggerUi from "swagger-ui-express";
import { generateOpenAPIDocument } from "./config/openapi";

const app = express();

// Swagger Documentation
const swaggerDocument = generateOpenAPIDocument();
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Todo List API Documentation',
}));

// OpenAPI JSON endpoint
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerDocument);
});
```

## Usage

### 1. Generate OpenAPI Specification

```bash
npm run docs:generate
```

This creates `openapi.json` with your complete API specification.

### 2. View Documentation

Start your server and visit:
- **Swagger UI**: `http://localhost:3000/api-docs`
- **OpenAPI JSON**: `http://localhost:3000/api-docs.json`

### 3. Integrate with Validation

Use the same schemas for request validation:

```typescript
import { validate } from '../middleware/validation';
import { registerSchema } from '../schemas/auth.schema';

router.post('/register', validate(registerSchema), authController.register);
```

## Best Practices

### 1. Schema Organization
- Keep schemas in dedicated files
- Use descriptive names and examples
- Add comprehensive descriptions

### 2. OpenAPI Metadata
```typescript
const schema = z.string().min(8).openapi({
  description: 'Password with minimum 8 characters',
  example: 'SecurePass123',
  minLength: 8,
});
```

### 3. Response Schemas
Define consistent response formats:

```typescript
export const ApiResponseSchema = z.object({
  success: z.boolean().openapi({ description: 'Request success status' }),
  data: z.any().openapi({ description: 'Response data' }),
  message: z.string().openapi({ description: 'Response message' }),
}).openapi({ title: 'ApiResponse' });
```

### 4. Error Handling
Create standardized error responses:

```typescript
export const ErrorResponseSchema = z.object({
  success: z.boolean().default(false),
  error: z.string().openapi({ description: 'Error message' }),
  stack: z.string().optional().openapi({ description: 'Error stack (dev only)' }),
}).openapi({ title: 'ErrorResponse' });
```

## Advanced Features

### 1. Custom Components
Register reusable components:

```typescript
registry.registerComponent('schemas', 'PaginationMeta', z.object({
  page: z.number(),
  limit: z.number(),
  total: z.number(),
}));
```

### 2. Path Parameters
```typescript
registry.registerPath({
  method: 'get',
  path: '/todos/{id}',
  request: {
    params: z.object({
      id: z.uuid().openapi({ description: 'Todo ID' }),
    }),
  },
  // ...
});
```

### 3. Query Parameters
```typescript
const querySchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  search: z.string().optional(),
});
```

## NPM Scripts

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "docs:generate": "ts-node src/scripts/generate-openapi.ts",
    "docs:serve": "npm start",
    "docs:validate": "swagger-codegen validate -i openapi.json"
  }
}
```

## Benefits

1. **Automatic Sync**: Documentation always matches your validation schemas
2. **Type Safety**: Full TypeScript support with inferred types
3. **Interactive Docs**: Swagger UI provides testing capabilities
4. **Code Generation**: Generate client SDKs from the OpenAPI spec
5. **API Testing**: Use the spec with testing tools like Postman
6. **Developer Experience**: Rich documentation improves API adoption

## Conclusion

Using Zod with OpenAPI provides a robust, type-safe approach to API documentation that scales with your application. The documentation is automatically generated from your validation schemas, ensuring consistency between what you validate and what you document.

## References

- [Zod](https://github.com/colinhacks/zod)
- [@asteasolutions/zod-to-openapi](https://github.com/asteasolutions/zod-to-openapi)
- [OpenAPI Specification](https://swagger.io/specification/)
- [Swagger UI](https://swagger.io/tools/swagger-ui/)
