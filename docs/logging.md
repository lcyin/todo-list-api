# Logging System

The Todo List API implements a dual logging system:

- Runtime console logs (Morgan + Winston console transport) for development
- File logs (Winston file transports) for persistent production monitoring

## Runtime Logs
- Human-readable, colored output
- Real-time feedback during development

## File Logs
- Structured JSON format
- Daily rotation, persistent storage in `logs/`
- Used for production monitoring, debugging, and audit trails

## Request Correlation
- All logs use request IDs for tracing

## Log Analysis
- Use tools like `jq`, `grep` for searching and analyzing logs
