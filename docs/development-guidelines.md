# Development Guidelines

When adding new features:

1. Create interfaces in `src/interfaces/`
2. Define validation schemas in `src/schemas/` using Zod
3. Add repository methods in `src/repositories/`
4. Implement business logic in `src/services/`
5. Create controller methods in `src/controllers/`
6. Define routes in `src/routes/`
7. Add integration tests in `*.int-spec.ts`
8. Update OpenAPI documentation
9. Consider user authorization
10. Add database migrations in `migrations/`
