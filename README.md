# Todo List API

A RESTful API for managing todo lists and tasks built with TypeScript and Express.

## 🚀 Quick Start

### Prerequisites
- Node.js (v22 or higher)
- npm or yarn

### Installation

#### Option 1: Quick Setup (Recommended)
```bash
git clone <repository-url>
cd todo-list-api
./scripts/setup.sh
```

#### Option 2: Manual Setup
1. Clone the repository:
```bash
git clone <repository-url>
cd todo-list-api
```

2. Install Node.js 22 (using nvm):
```bash
nvm install 22
nvm use 22
```

3. Install dependencies:
```bash
npm install
```

4. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start development server:
```bash
npm run dev
```

5. Visit http://localhost:3000/health to verify the API is running

## 📚 API Documentation

The API includes comprehensive Swagger/OpenAPI documentation:

- **Interactive Documentation**: <http://localhost:3000/api-docs>
- **JSON Specification**: <http://localhost:3000/api-docs.json>
- **API Information**: <http://localhost:3000/api/v1/docs>

The Swagger UI provides:

- Complete API endpoint documentation
- Interactive testing interface
- Request/response examples
- Schema definitions
- Authentication requirements (if applicable)

### Quick API Overview

- **Health Checks**: `GET /health`, `GET /api/v1/health`
- **Todo Operations**: All CRUD operations under `/api/v1/todos`
- **Documentation**: Multiple formats for API documentation

### GitHub Pages Deployment

You can deploy the Swagger documentation to GitHub Pages:

#### Automatic Deployment (Recommended)
The repository includes a GitHub Action that automatically builds and deploys documentation to GitHub Pages on every push to main branch.

1. Go to your repository **Settings** → **Pages**
2. Set **Source** to "GitHub Actions"
3. Push changes to the main branch
4. Documentation will be available at: `https://[username].github.io/[repository-name]/`

#### Manual Deployment
Generate static documentation manually:

```bash
npm run docs:generate
```

Then enable GitHub Pages pointing to the `docs/` folder.

## 📜 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the project for production
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run test:docs` - Test API documentation endpoints
- `npm run docs:generate` - Generate static documentation for GitHub Pages
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

1. **Follow the coding standards** defined in `.github/instructions/copilot-instructions.md`
2. **Follow TypeScript performance best practices** defined in `TYP.github/instructions/typescript.instructions.md`
3. **Follow REST API architecture standards** defined in `.github/instructions/rest-api-standard.instructions.md`
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
