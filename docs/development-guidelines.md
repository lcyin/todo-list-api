## Development Guidelines

When adding new features:

1. **Create interfaces** in `src/interfaces/` for any new data structures
2. **Define validation schemas** in `src/schemas/` using Zod for both validation and OpenAPI generation
3. **Add repository methods** in `src/repositories/` for database operations
4. **Implement business logic** in `src/services/` with proper error handling
5. **Create controller methods** in `src/controllers/` for HTTP handling and authentication checks
6. **Define routes** in `src/routes/` with validation middleware and authentication
7. **Add integration tests** in `*.int-spec.ts` files for full API testing
8. **Update OpenAPI documentation** via Zod schema annotations
9. **Consider user authorization** for multi-user data access patterns
10. **Add database migrations** for schema changes in `migrations/` directory