# Todo List API

A RESTful API for managing todo lists and tasks built with TypeScript and Express.

## 🚀 Quick Start

### Prerequisites
- Node.js (v22 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd todo-list-api
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start development server:
```bash
npm run dev
```

5. Visit http://localhost:3000/health to verify the API is running

## 📜 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the project for production
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues

## Development Guidelines

### Project Structure
```
src/
├── controllers/     # Request handlers
├── models/         # Data models and schemas
├── routes/         # API route definitions
├── middleware/     # Custom middleware
├── services/       # Business logic
├── utils/          # Utility functions
└── config/         # Configuration files
```

### Copilot Usage Guidelines

When working with GitHub Copilot on this project:

1. **Follow the coding standards** defined in `COPILOT_GUIDELINES.md`
2. **Follow TypeScript performance best practices** defined in `TYPESCRIPT_PERFORMANCE_GUIDELINES.md`
3. **Follow REST API architecture standards** defined in `REST_API_ARCHITECTURE_STANDARDS.md`
4. **Use descriptive comments** to help Copilot understand context
5. **Write clear function signatures** with proper TypeScript types
6. **Include JSDoc comments** for complex functions
7. **Follow consistent naming patterns** throughout the codebase

### API Endpoints

All endpoints should follow these patterns:
- `GET /api/todos` - List all todos (with pagination)
- `GET /api/todos/:id` - Get a specific todo
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/:id` - Update a todo
- `DELETE /api/todos/:id` - Delete a todo

### Error Handling

Use consistent error response format:
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": {}
  }
}
```

### Environment Variables

Required environment variables:
- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port
- `DATABASE_URL` - Database connection string
- `JWT_SECRET` - Secret for JWT tokens
