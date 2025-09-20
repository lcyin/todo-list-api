# Docker & Environment Management Strategy

- Multi-container Docker setup: app (Node.js/TypeScript) and postgres (PostgreSQL)
- Environment detection logic for config loading
- Environment file strategy: `.env`, `.env.test`, `.env.deploy`
- Dockerfile: multi-stage build, non-root user, production optimization
- Docker Compose: development and production setups
- Security: non-root execution, network isolation, secret management
- Database connection flow and port strategy
- Health checks and resource limits for production
