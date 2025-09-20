

## Input Validation with Zod

This project uses **Zod** for runtime type checking and input validation:

### Validation Features:
- **Type-safe schemas** with TypeScript integration
- **Request validation** for body, parameters, and query strings
- **Custom error messages** with detailed validation feedback
- **Data transformation** (trimming, optional field handling)
- **Consistent error responses** following API format

### Schema Structure:
```typescript
// Example schema for creating a todo
export const createTodoSchema = z.object({
  body: z.object({
    title: z.string().trim().min(1, 'Title is required').max(200),
    description: z.string().max(1000).optional()
  })
});
```

### Validation Rules:
- **Title**: Required, 1-200 characters, automatically trimmed
- **Description**: Optional, max 1000 characters
- **ID Parameters**: Must be valid UUID format
- **Updates**: At least one field required for update operations

### Error Response Format:
```json
{
  "success": false,
  "error": "Validation failed: body.title: Title is required"
}
```
