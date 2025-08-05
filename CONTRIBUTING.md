# Contributing to Todo List API

## Development Workflow

### Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy environment file: `cp .env.example .env`
4. Start development server: `npm run dev`

### Git Workflow

We follow a feature branch workflow:

1. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes:**
   - Follow the coding guidelines in the project documentation
   - Write tests for new functionality
   - Ensure all existing tests pass

3. **Commit your changes:**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

4. **Push your branch:**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create a Pull Request**

### Commit Message Convention

We use conventional commits:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

### Code Standards

- Follow the guidelines in `COPILOT_GUIDELINES.md`
- Use TypeScript performance patterns from `TYPESCRIPT_PERFORMANCE_GUIDELINES.md`
- Follow REST API standards from `REST_API_ARCHITECTURE_STANDARDS.md`
- Run `npm run lint` before committing
- Ensure `npm test` passes

### Testing

- Write unit tests for new functionality
- Ensure all tests pass before submitting PR
- Include integration tests for API endpoints

### Documentation

- Update README.md if adding new features
- Document new API endpoints
- Update relevant guideline files if changing standards
