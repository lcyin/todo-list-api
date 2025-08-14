# API Documentation Guide

The API includes comprehensive Swagger/OpenAPI documentation and detailed endpoint information.

## Interactive Documentation

The API provides interactive Swagger documentation:

- **Interactive Documentation**: <http://localhost:3000/api-docs>
- **JSON Specification**: <http://localhost:3000/api-docs.json>

The Swagger UI provides:

- Complete API endpoint documentation
- Interactive testing interface
- Request/response examples
- Schema definitions

## API Endpoints

Current REST API endpoints following RESTful conventions:

- `GET /health` - Root-level health check
- `GET /api/v1/health` - Versioned health check
- `GET /api/v1/todos` - List all todos (with pagination and filtering)
- `GET /api/v1/todos/:id` - Get a specific todo by ID
- `POST /api/v1/todos` - Create a new todo
- `PUT /api/v1/todos/:id` - Update a todo
- `DELETE /api/v1/todos/:id` - Delete a todo

## Error Handling

The API uses consistent error response format across all endpoints:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message"
  }
}
```

Common error codes:
- `ROUTE_NOT_FOUND` - Invalid endpoint
- `TODO_NOT_FOUND` - Todo with specified ID doesn't exist
- `INVALID_TODO_DATA` - Invalid request body
- `INVALID_QUERY_PARAMETERS` - Invalid query parameters
- `INTERNAL_SERVER_ERROR` - Unexpected server error

## GitHub Pages Documentation Deployment

The Swagger documentation can be deployed to GitHub Pages for easy access:

### Automatic Deployment (Recommended)

Set up GitHub Actions to automatically deploy documentation:

1. Go to your repository **Settings** → **Pages**
2. Set **Source** to "GitHub Actions"
3. Push changes to the main branch
4. Documentation will be available at: `https://[username].github.io/[repository-name]/`

### Manual Deployment

You can manually generate and deploy documentation by setting up GitHub Pages to serve from the `docs/` folder and creating static HTML files from your Swagger specification.
