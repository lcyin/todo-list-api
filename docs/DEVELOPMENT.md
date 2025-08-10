# Development Guide

## Code Formatting and Linting

This project uses **ESLint** for code linting and **Prettier** for code formatting to maintain consistent code style across the team.

## Available Commands

### Linting
```bash
# Check for linting and formatting issues
npm run lint

# Fix linting and formatting issues automatically
npm run lint:fix
```

### Formatting (Prettier)
```bash
# Check if files are formatted correctly
npm run format:check

# Format all TypeScript files
npm run format
```

## Configuration

### Prettier Configuration (`.prettierrc.json`)
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": false,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "bracketSameLine": false,
  "arrowParens": "avoid"
}
```

### ESLint Configuration (`.eslintrc.json`)
- Extends recommended ESLint rules
- Integrates with Prettier to avoid conflicts
- Includes TypeScript-specific rules
- Custom rules for Node.js environment

## Workflow Integration

### Pre-commit Workflow
1. Run `npm run lint` to check for issues
2. Run `npm run lint:fix` to automatically fix issues
3. Commit your changes

### VS Code Integration
To get automatic formatting on save, add this to your VS Code settings:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

### Recommended VS Code Extensions
- **Prettier - Code formatter** (`esbenp.prettier-vscode`)
- **ESLint** (`dbaeumer.vscode-eslint`)

## Formatting Rules

### Key Prettier Rules Applied:
- **Semicolons**: Always required
- **Quotes**: Double quotes preferred
- **Line Width**: 100 characters maximum
- **Indentation**: 2 spaces
- **Trailing Commas**: ES5 compatible (objects, arrays)

### Example Before/After:

**Before:**
```typescript
export class Todo{
constructor(
public readonly id:string,
public readonly title:string,
public readonly completed:boolean
){
this.validateTitle()
}
}
```

**After (Prettier formatted):**
```typescript
export class Todo {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly completed: boolean
  ) {
    this.validateTitle();
  }
}
```

## Troubleshooting

### Common Issues:

1. **TypeScript version warning**: This is expected and can be ignored
2. **Prettier conflicts with ESLint**: Use `npm run lint:fix` to resolve
3. **Files not formatting**: Check if files are included in `.prettierignore`

### Manual Formatting:
If automatic formatting fails, you can manually format specific files:
```bash
npx prettier --write src/path/to/file.ts
npx eslint src/path/to/file.ts --fix
```

## Best Practices

1. **Always run linting before committing**
2. **Use `npm run lint:fix` for bulk fixes**
3. **Configure your editor for automatic formatting**
4. **Don't ignore Prettier rules** - they ensure consistency
5. **Review formatted changes** before committing

## Integration with CI/CD

Add this to your CI pipeline to ensure code quality:
```yaml
- name: Lint and Format Check
  run: |
    npm run lint
    npm run format:check
```

This ensures all code follows the established formatting standards before deployment.

## Testing

For comprehensive testing guidelines, patterns, and best practices, see [`TESTING.md`](./TESTING.md).

Key testing resources:

- Testing philosophy and style guide
- Integration testing strategy
- Test naming conventions
- Error testing patterns
