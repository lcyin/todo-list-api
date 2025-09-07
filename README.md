# Todo List API

A RESTful API for managing todos built with Express.js and TypeScript.

## Features

- ✅ Full CRUD operations for todos
- 🔒 Security middleware (Helmet)
- 🌐 CORS enabled
- 📝 Request logging with Morgan
- 🛡️ Error handling middleware
- 📊 TypeScript for type safety
- 🚀 Hot reload with Nodemon

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server:
```bash
npm run dev
```

The server will run on `http://localhost:3000`

### Production

Build and start the production server:
```bash
npm run build
npm start
```

## API Endpoints

### Health Check
- `GET /health` - Check API status

### Todos
- `GET /api/todos` - Get all todos
- `GET /api/todos/:id` - Get todo by ID
- `POST /api/todos` - Create new todo
- `PUT /api/todos/:id` - Update todo
- `DELETE /api/todos/:id` - Delete todo

### Example Requests

#### Create Todo
```bash
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "Learn TypeScript", "description": "Study TS fundamentals"}'
```

#### Get All Todos
```bash
curl http://localhost:3000/api/todos
```

#### Update Todo
```bash
curl -X PUT http://localhost:3000/api/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'
```

## Project Structure

```
src/
├── app.ts              # Main application file
├── controllers/        # Request handlers
│   └── todoController.ts
├── middleware/         # Custom middleware
│   └── errorHandler.ts
├── routes/            # Route definitions
│   └── todos.ts
└── types/             # TypeScript type definitions
    └── todo.ts
```

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm test` - Run tests (placeholder)

## Environment Variables

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
