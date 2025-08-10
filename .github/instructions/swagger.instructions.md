# Swagger/OpenAPI Documentation Instructions

## Overview

This document provides comprehensive instructions for maintaining and extending the Swagger/OpenAPI 3.0 documentation in the Todo List API project. The implementation follows industry best practices and provides interactive documentation for all API endpoints.

## Architecture

### Documentation Structure

```
src/
├── config/
│   └── swagger.ts          # Swagger configuration and schemas
├── routes/
│   ├── docsRoutes.ts       # Documentation endpoints
│   ├── healthRoutes.ts     # Health endpoints with Swagger annotations
│   └── todoRoutes.ts       # Todo endpoints with Swagger annotations
└── app.ts                  # Swagger UI integration
```

### Key Components

1. **Swagger Configuration** (`src/config/swagger.ts`)
   - OpenAPI 3.0 specification
   - Schema definitions
   - Server configurations
   - Component schemas and responses

2. **Route Annotations**
   - JSDoc-style Swagger annotations
   - Embedded in route files
   - Auto-generated documentation

3. **Documentation Endpoints**
   - `/api-docs` - Interactive Swagger UI
   - `/api-docs.json` - OpenAPI JSON specification
   - `/api/v1/docs` - API information endpoint

## Adding New Endpoints

### 1. Basic Endpoint Documentation

When adding a new route, include Swagger annotations using JSDoc format:

```typescript
/**
 * @swagger
 * /api/v1/endpoint:
 *   get:
 *     summary: Brief description
 *     description: Detailed description
 *     tags: [TagName]
 *     parameters:
 *       - in: query
 *         name: paramName
 *         schema:
 *           type: string
 *         description: Parameter description
 *     responses:
 *       200:
 *         description: Success response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResponseSchema'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */
router.get("/endpoint", controller.method);
```

### 2. Request Body Documentation

For endpoints that accept request bodies:

```typescript
/**
 * @swagger
 * /api/v1/endpoint:
 *   post:
 *     summary: Create new resource
 *     tags: [TagName]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateRequest'
 *           examples:
 *             simple:
 *               summary: Simple example
 *               value:
 *                 field: "example value"
 *             detailed:
 *               summary: Detailed example
 *               value:
 *                 field: "example value"
 *                 optional: "additional data"
 *     responses:
 *       201:
 *         description: Resource created successfully
 */
```

### 3. Path Parameters

For endpoints with path parameters:

```typescript
/**
 * @swagger
 * /api/v1/resource/{id}:
 *   get:
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier
 *         example: "resource-123"
 */
```

## Schema Definitions

### Adding New Schemas

Add new schemas to `src/config/swagger.ts` in the `components.schemas` section:

```typescript
NewResourceSchema: {
  type: "object",
  required: ["field1", "field2"],
  properties: {
    id: {
      type: "string",
      description: "Unique identifier",
      example: "resource-123",
    },
    field1: {
      type: "string",
      maxLength: 100,
      description: "Required field description",
      example: "Example value",
    },
    field2: {
      type: "boolean",
      description: "Boolean field description",
      example: true,
    },
    optional: {
      type: "string",
      nullable: true,
      description: "Optional field description",
      example: null,
    },
  },
},
```

### Schema Naming Conventions

1. **Entity Schemas**: Use the entity name (e.g., `Todo`, `User`)
2. **Request Schemas**: Add `Request` suffix (e.g., `CreateTodoRequest`)
3. **Response Schemas**: Add `Response` suffix (e.g., `TodosResponse`)
4. **Error Schemas**: Use descriptive names (e.g., `ErrorResponse`, `ValidationError`)

## Best Practices

### 1. Documentation Quality

- **Clear Descriptions**: Write clear, concise descriptions for all endpoints
- **Realistic Examples**: Provide realistic example data
- **Complete Parameters**: Document all parameters with types and constraints
- **Error Responses**: Document all possible error responses

### 2. Schema Design

- **Consistent Types**: Use consistent data types across schemas
- **Validation Rules**: Include validation constraints (maxLength, minimum, etc.)
- **Nullable Fields**: Explicitly mark nullable fields
- **Required Fields**: Clearly specify required vs optional fields

### 3. Organization

- **Logical Tags**: Group related endpoints with meaningful tags
- **Consistent Naming**: Use consistent naming conventions
- **Proper Nesting**: Use schema references ($ref) to avoid duplication

### 4. Examples

- **Multiple Examples**: Provide multiple examples for complex endpoints
- **Edge Cases**: Include examples for edge cases and error scenarios
- **Realistic Data**: Use realistic, meaningful example data

## Common Patterns

### 1. Pagination Response

```typescript
PaginatedResponse: {
  type: "object",
  properties: {
    data: {
      type: "array",
      items: {
        $ref: "#/components/schemas/EntitySchema",
      },
    },
    pagination: {
      type: "object",
      properties: {
        page: { type: "integer", example: 1 },
        limit: { type: "integer", example: 10 },
        total: { type: "integer", example: 100 },
        totalPages: { type: "integer", example: 10 },
      },
    },
  },
},
```

### 2. Error Response

```typescript
ErrorResponse: {
  type: "object",
  properties: {
    error: {
      type: "object",
      properties: {
        code: {
          type: "string",
          description: "Error code",
          example: "RESOURCE_NOT_FOUND",
        },
        message: {
          type: "string",
          description: "Human readable error message",
          example: "Resource with id '123' not found",
        },
        details: {
          type: "object",
          description: "Additional error details",
        },
      },
    },
  },
},
```

### 3. Common Response References

```typescript
responses: {
  NotFound: {
    description: "Resource not found",
    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/ErrorResponse",
        },
      },
    },
  },
  BadRequest: {
    description: "Bad request",
    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/ErrorResponse",
        },
      },
    },
  },
}
```

## Testing Documentation

### Automated Testing

Use the provided test script to validate documentation:

```bash
npm run test:docs
```

### Manual Testing

1. **Start Development Server**:

   ```bash
   npm run dev
   ```

2. **Access Documentation**:
   - Interactive UI: http://localhost:3000/api-docs
   - JSON Spec: http://localhost:3000/api-docs.json
   - API Info: http://localhost:3000/api/v1/docs

3. **Test Endpoints**:
   - Use Swagger UI "Try it out" feature
   - Validate request/response formats
   - Test error scenarios

### Validation Checklist

- [ ] All endpoints are documented
- [ ] All parameters are described
- [ ] Request/response schemas are complete
- [ ] Examples are realistic and helpful
- [ ] Error responses are documented
- [ ] Tags are properly assigned
- [ ] No broken schema references

## Maintenance

### Regular Updates

1. **New Features**: Document all new endpoints immediately
2. **Schema Changes**: Update schemas when data models change
3. **Deprecations**: Mark deprecated endpoints clearly
4. **Version Updates**: Update version numbers when releasing

### Review Process

1. **Code Reviews**: Include documentation review in code reviews
2. **Testing**: Test documentation changes before deployment
3. **Consistency**: Ensure consistency with existing documentation
4. **Completeness**: Verify all endpoints are properly documented

## Troubleshooting

### Common Issues

1. **Schema Reference Errors**:
   - Check schema names match exactly
   - Verify schema is defined in swagger.ts

2. **Missing Documentation**:
   - Ensure route files are included in swagger.ts apis array
   - Check JSDoc comment format

3. **Invalid OpenAPI**:
   - Validate JSON spec at /api-docs.json
   - Use online OpenAPI validators

### Debug Tips

1. **Check Console**: Look for swagger-jsdoc parsing errors
2. **Validate JSON**: Test the generated JSON specification
3. **Compare Working Examples**: Use existing documentation as reference
4. **Documentation Tools**: Use external tools to validate OpenAPI specs

## Integration with Development Workflow

### Pre-commit Checks

1. Run documentation tests: `npm run test:docs`
2. Validate OpenAPI specification
3. Check for completeness of new endpoints

### CI/CD Integration

1. Include documentation tests in CI pipeline
2. Generate and deploy documentation automatically
3. Validate documentation completeness

### Code Review Guidelines

1. Review documentation alongside code changes
2. Ensure examples are updated
3. Verify schema accuracy
4. Check for consistency with existing patterns

This comprehensive documentation system ensures that the API remains well-documented, discoverable, and easy to use for both internal development and external consumers.
