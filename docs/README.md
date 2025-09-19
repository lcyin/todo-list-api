# Zod to OpenAPI Example

This project demonstrates how to automatically generate OpenAPI/Swagger documentation from Zod validation schemas.

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install @asteasolutions/zod-to-openapi swagger-ui-express
   ```

2. **Generate OpenAPI spec**:
   ```bash
   npm run docs:generate
   ```

3. **Start the server**:
   ```bash
   npm run dev
   ```

4. **View documentation**:
   - Swagger UI: http://localhost:3000/api-docs
   - OpenAPI JSON: http://localhost:3000/api-docs.json

## What This Setup Provides

### 🔄 Automatic Generation
Your API documentation is automatically generated from your Zod validation schemas. No manual documentation updates needed!

### 📚 Interactive Documentation
Access a full Swagger UI interface where you can:
- Browse all endpoints
- See request/response schemas
- Test endpoints directly
- Download the OpenAPI specification

### 🔒 Type Safety
Full TypeScript support with types automatically inferred from your Zod schemas.

### ✅ Validation & Documentation in Sync
The same schemas that validate your API requests also generate your documentation, ensuring they never get out of sync.

## Key Features Implemented

1. **Schema Definition with OpenAPI Metadata**:
   ```typescript
   export const UserSchema = z.object({
     id: z.uuid().openapi({ 
       description: 'Unique user identifier', 
       example: '123e4567-e89b-12d3-a456-426614174000' 
     }),
     email: z.string().email().openapi({ 
       description: 'User email address', 
       example: 'john@example.com' 
     }),
   }).openapi({ title: 'User', description: 'User object' });
   ```

2. **Automatic Route Documentation**:
   ```typescript
   registry.registerPath({
     method: 'post',
     path: '/auth/register',
     description: 'Register a new user',
     request: { body: { content: { 'application/json': { schema: registerSchema.shape.body }}}},
     responses: { 201: { description: 'User registered', content: { 'application/json': { schema: AuthResponseSchema }}}},
   });
   ```

3. **JWT Authentication Documentation**:
   ```typescript
   registry.registerComponent('securitySchemes', 'bearerAuth', {
     type: 'http',
     scheme: 'bearer',
     bearerFormat: 'JWT',
   });
   ```

## Available Endpoints

The generated documentation includes:

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/profile` - Get user profile
- `PUT /auth/profile` - Update user profile
- `PUT /auth/change-password` - Change password
- `DELETE /auth/account` - Delete account

### Todos
- `GET /todos` - Get all todos
- `POST /todos` - Create todo
- `GET /todos/{id}` - Get todo by ID
- `PUT /todos/{id}` - Update todo
- `DELETE /todos/{id}` - Delete todo

## Benefits

- ✅ **No duplicate effort** - Write schemas once, get validation + docs
- ✅ **Always up-to-date** - Documentation automatically reflects code changes
- ✅ **Type-safe** - Full TypeScript support
- ✅ **Interactive** - Test endpoints directly in Swagger UI
- ✅ **Standards-compliant** - Valid OpenAPI 3.0 specification
- ✅ **Developer-friendly** - Rich, searchable documentation

## Next Steps

You can extend this setup by:
- Adding more detailed examples to schemas
- Implementing pagination documentation
- Adding response code documentation
- Creating client SDKs from the OpenAPI spec
- Integrating with API testing tools
