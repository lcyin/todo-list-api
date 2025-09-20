# API Endpoints

## Health Check
- `GET /health` - Check API status

## Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user (with token blacklisting)
- `GET /api/auth/profile` - Get current user profile (requires auth)
- `PUT /api/auth/profile` - Update user profile (requires auth)
- `PUT /api/auth/change-password` - Change user password (requires auth)
- `POST /api/auth/verify-token` - Verify JWT token validity

## Todos
- `GET /api/todos` - Get all todos for authenticated user
- `GET /api/todos/:id` - Get todo by ID (user-owned only)
- `POST /api/todos` - Create new todo for authenticated user
- `PUT /api/todos/:id` - Update user's todo
- `DELETE /api/todos/:id` - Delete user's todo

## Documentation
- `GET /api-docs` - Interactive Swagger UI documentation
- `GET /api-docs.json` - OpenAPI JSON specification
