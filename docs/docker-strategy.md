# Docker Setup and Environment Management Strategy

This document explains the Docker containerization approach and environment management strategy used in the Todo List API project.

## Overview

The project uses a multi-container Docker setup with environment-specific configuration management to support different deployment scenarios while maintaining security and flexibility.

## Architecture

### Container Services

```mermaid
graph TB
    A[Client/Browser] --> B[App Container :3000]
    B --> C[PostgreSQL Container :5432]
    D[External Tools<br/>Postico/pgAdmin] --> C
    E[Host :25433] --> C
```

**Services:**
- **`app`**: Node.js/TypeScript application container
- **`postgres`**: PostgreSQL 15 database container

### Network Configuration

| Service | Internal Port | External Port | Purpose |
|---------|---------------|---------------|---------|
| app | 3000 | 3000 | API access |
| postgres | 5432 | 25433 | Database access (external tools) |

## Environment Management Strategy

### 1. Environment Detection Logic

The application uses a sophisticated environment detection system in `src/config/config.ts`:

```typescript
const nodeEnv = process.env.NODE_ENV || "local";
let envFile = ".env";

if (nodeEnv === "test") {
  envFile = ".env.test";
}

if (["development", "production"].includes(nodeEnv)) {
  envFile = `.env.deploy`;
}
```

### 2. Environment File Strategy

| Environment | File | Description |
|-------------|------|-------------|
| `local` | `.env` | Local development (default) |
| `test` | `.env.test` | Testing environment |
| `development` | `.env.deploy` | Docker development |
| `production` | `.env.deploy` | Docker production |

### 3. Configuration Priority

1. **Environment Variables** (highest priority)
2. **Environment Files** (`.env`, `.env.test`, `.env.deploy`)
3. **Default Values** (fallback)

## Docker Configuration

### Dockerfile Strategy

The Dockerfile implements a multi-stage approach for optimization:

```dockerfile
# 1. Install all dependencies (including dev)
RUN npm ci

# 2. Build TypeScript application
RUN npm run build && \
    npx tsc src/scripts/migrate.ts --outDir dist/scripts

# 3. Remove dev dependencies for smaller image
RUN npm prune --production

# 4. Security: Run as non-root user
USER nodejs
```

**Key Features:**
- **Multi-stage build**: Installs dev dependencies, builds, then removes them
- **Migration compilation**: Compiles migration scripts for production use
- **Security**: Non-root user execution
- **Optimization**: Minimal production image

### Docker Compose Configuration

#### Development Setup

```yaml
services:
  app:
    build: .
    environment:
      - DB_HOST=postgres      # Docker service name
      - DB_PORT=5432         # Internal container port
      - DB_NAME=todo_list
      - DB_USER=postgres
      - DB_PASSWORD=password
      - JWT_SECRET=your-super-secret-jwt-key
    volumes:
      - .:/app              # Live code reloading
      - /app/node_modules   # Persist node_modules
```

#### Database Configuration

```yaml
postgres:
  image: postgres:15-alpine
  environment:
    - POSTGRES_DB=todo_list    # Auto-creates database
    - POSTGRES_USER=postgres
    - POSTGRES_PASSWORD=password
  ports:
    - "25433:5432"            # External access port
  volumes:
    - postgres_data:/var/lib/postgresql/data  # Persistent storage
```

## Environment Variable Management

### Current Approach: Direct Environment Variables

**Pros:**
- Simple and straightforward
- Works well for development
- Easy to understand and debug

**Cons:**
- Secrets visible in docker-compose.yml
- Not suitable for production deployments
- No secret rotation capability

### Recommended Production Approach

#### Option 1: External .env File

```bash
# .env.deploy
DB_HOST=postgres
DB_PORT=5432
DB_NAME=todo_list
DB_USER=postgres
DB_PASSWORD=super_secure_random_password
JWT_SECRET=ultra_secure_jwt_secret_at_least_32_characters_long
```

```yaml
# docker-compose.yml
services:
  app:
    env_file:
      - .env.deploy
```

#### Option 2: Docker Secrets (Production)

```yaml
services:
  app:
    environment:
      - DB_PASSWORD_FILE=/run/secrets/db_password
      - JWT_SECRET_FILE=/run/secrets/jwt_secret
    secrets:
      - db_password
      - jwt_secret

secrets:
  db_password:
    external: true
  jwt_secret:
    external: true
```

## Port Strategy Explanation

### Internal Communication (Container-to-Container)

```
app container → postgres container
postgres:5432
```

The app connects using:
- **Host**: `postgres` (Docker service name)
- **Port**: `5432` (internal container port)

### External Access (Host-to-Container)

```
localhost:25433 → postgres:5432
```

External tools connect using:
- **Host**: `localhost`
- **Port**: `25433` (mapped external port)

**Why use port 25433?**
- Avoids conflicts with local PostgreSQL installations
- Clear separation between local and containerized services
- Allows running both local and Docker PostgreSQL simultaneously

## Database Connection Flow

### 1. Application Startup

```typescript
// config.ts loads environment variables
const config = {
  database: {
    host: process.env.DB_HOST || "localhost",     // "postgres" in Docker
    port: parseInt(process.env.DB_PORT || "5432"), // 5432 in Docker
    name: process.env.DB_NAME || "todo_list",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "password"
  }
}
```

### 2. Database Connection

```typescript
// Database client connects using Docker network
const client = new Client({
  host: "postgres",  // Docker service name resolves to container IP
  port: 5432,        // Internal container port
  database: "todo_list",
  user: "postgres",
  password: "password"
});
```

## Security Considerations

### Current Security Features

1. **Non-root execution**: App runs as `nodejs` user
2. **Minimal image**: Only production dependencies in final image
3. **Network isolation**: Services communicate via Docker network
4. **Volume security**: Proper volume mounting strategies

### Security Improvements for Production

1. **Secret Management**:
   ```bash
   # Use external secret management
   docker secret create db_password password.txt
   docker secret create jwt_secret jwt.txt
   ```

2. **Network Security**:
   ```yaml
   networks:
     app-network:
       driver: bridge
       internal: true  # No external access
   ```

3. **Image Scanning**:
   ```bash
   # Scan for vulnerabilities
   docker scout cves todo-list-api:latest
   ```

## Development Workflow

### 1. Initial Setup

```bash
git clone <repository>
cd todo-list-api
docker-compose up --build
```

### 2. Database Setup

```bash
# Run migrations
docker-compose exec app npm run migrate:prod

# Verify connection
docker-compose exec postgres psql -U postgres -d todo_list -c "\l"
```

### 3. Development Commands

```bash
# View logs
docker-compose logs -f app

# Execute commands in container
docker-compose exec app npm test
docker-compose exec app npm run migrate:prod

# Database access
docker-compose exec postgres psql -U postgres -d todo_list
```

### 4. External Database Access

```bash
# Using psql
psql -h localhost -p 25433 -U postgres -d todo_list

# Using connection string
postgresql://postgres:password@localhost:25433/todo_list
```

## Production Deployment Considerations

### 1. Environment Separation

```yaml
# docker-compose.prod.yml
services:
  app:
    environment:
      - NODE_ENV=production
      - DB_HOST=${DB_HOST}
      - DB_PASSWORD=${DB_PASSWORD}
    volumes: []  # Remove development volumes
```

### 2. Health Checks

```yaml
services:
  app:
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  postgres:
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres -d todo_list"]
      interval: 10s
      timeout: 5s
      retries: 5
```

### 3. Resource Limits

```yaml
services:
  app:
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '0.5'
        reservations:
          memory: 256M
          cpus: '0.25'
```

## Troubleshooting

### Common Issues

1. **Connection Refused Errors**:
   ```bash
   # Check if services are running
   docker-compose ps
   
   # Verify network connectivity
   docker-compose exec app ping postgres
   ```

2. **Environment Variable Issues**:
   ```bash
   # Check loaded environment
   docker-compose exec app env | grep DB_
   ```

3. **Database Issues**:
   ```bash
   # Check database exists
   docker-compose exec postgres psql -U postgres -l
   ```

### Reset Commands

```bash
# Complete reset (⚠️ loses all data)
docker-compose down -v
docker system prune -f
docker-compose up --build
```

## Future Improvements

### 1. Secret Management
- Implement HashiCorp Vault integration
- Use Kubernetes secrets for K8s deployments
- Add secret rotation mechanisms

### 2. Monitoring
- Add Prometheus metrics
- Implement structured logging
- Add performance monitoring

### 3. Security
- Implement security scanning in CI/CD
- Add network policies
- Regular dependency updates

### 4. Development Experience
- Add hot reloading for TypeScript
- Implement debug configurations
- Add development seed data

## Best Practices Summary

1. **Always use environment variables for configuration**
2. **Never commit secrets to version control**
3. **Use different ports for external access to avoid conflicts**
4. **Implement proper health checks for production**
5. **Use volume mounts for persistent data**
6. **Run containers as non-root users**
7. **Keep production images minimal and secure**
8. **Document all environment variables and their purposes**

This strategy ensures secure, scalable, and maintainable Docker deployments while supporting different environments and deployment scenarios.
