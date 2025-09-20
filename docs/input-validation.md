# Input Validation with Zod

- Type-safe schemas with TypeScript integration
- Request validation for body, parameters, and query strings
- Custom error messages and detailed feedback
- Data transformation and consistent error responses
- Example schema for creating a todo:

```typescript
export const createTodoSchema = z.object({
  body: z.object({ /* ... */ })
});
```
