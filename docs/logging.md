# Logging System Documentation

## Overview

The Todo List API implements a dual logging system designed to serve different purposes during development and production. This document explains the differences between runtime logs and file logs, when to use each, and how they complement each other.

## 📊 Two Logging Systems

### 1. Runtime Console Logs
**What you see in the terminal during development**

- **Source**: Morgan middleware + Winston console transport
- **Purpose**: Real-time monitoring and immediate feedback
- **Format**: Human-readable, colored output
- **Storage**: Terminal output only (not persisted)
- **Visibility**: Only when `NODE_ENV !== 'production'`

### 2. File Logs
**Persistent logs written to the `logs/` directory**

- **Source**: Winston file transports (DailyRotateFile)
- **Purpose**: Persistent logging for production monitoring and debugging
- **Format**: Structured JSON for easy parsing and analysis
- **Storage**: Daily rotating files with automatic cleanup
- **Visibility**: Always active (both development and production)

## 🔍 Detailed Comparison

| Aspect | Runtime Console Logs | File Logs |
|--------|---------------------|-----------|
| **Format** | Human-readable, colored | Structured JSON |
| **Persistence** | Temporary (lost on restart) | Permanent (disk storage) |
| **Environment** | Development only | All environments |
| **Purpose** | Real-time feedback | Historical analysis |
| **Searchability** | Limited | Full text search, filtering |
| **Performance** | Faster display | Optimized for storage |
| **Rotation** | N/A | Daily rotation with cleanup |

## 📝 Log Format Examples

### Runtime Console Logs
```bash
# Morgan HTTP logs (simple format)
POST /api/todos 201 25.123 ms - 273

# Winston console logs (colored, human-readable)
2025-09-08 10:30:15:123 info: 🚀 Server running on port 3000
2025-09-08 10:30:15:145 info: Incoming POST /api/todos
2025-09-08 10:30:15:167 info: Response 201 POST /api/todos
```

### File Logs (JSON Structure)
```json
{
  "level": "info",
  "message": "🚀 Server running on port 3000",
  "port": 3000,
  "environment": "development",
  "service": "todo-api",
  "timestamp": "2025-09-08T10:30:15.123Z"
}

{
  "ip": "::ffff:127.0.0.1",
  "level": "info",
  "message": "Incoming POST /api/todos",
  "method": "POST",
  "requestId": "req_1725789015123_abc123def",
  "service": "todo-api",
  "timestamp": "2025-09-08T10:30:15.145Z",
  "url": "/api/todos",
  "userAgent": "curl/7.68.0",
  "contentType": "application/json",
  "body": {
    "title": "New Todo",
    "description": "Task description"
  }
}

{
  "contentLength": "273 bytes",
  "level": "info",
  "message": "Response 201 POST /api/todos",
  "method": "POST",
  "requestId": "req_1725789015123_abc123def",
  "responseTime": "25ms",
  "service": "todo-api",
  "statusCode": 201,
  "timestamp": "2025-09-08T10:30:15.167Z",
  "url": "/api/todos"
}
```

## 🎯 When to Use Each

### Use Runtime Logs For:
- ✅ **Active development** - Quick feedback while coding
- ✅ **Real-time debugging** - See immediate responses
- ✅ **Monitoring server startup** - Check if server starts correctly
- ✅ **Quick troubleshooting** - Fast visual feedback
- ✅ **Development workflow** - Immediate error detection

### Use File Logs For:
- ✅ **Production monitoring** - Historical analysis and monitoring
- ✅ **Post-mortem debugging** - Investigate past issues and incidents
- ✅ **Performance analysis** - Analyze response times and patterns over time
- ✅ **Audit trails** - Track all API usage and user actions
- ✅ **Log aggregation** - Send to monitoring tools (ELK stack, Splunk, etc.)
- ✅ **Compliance** - Meet regulatory requirements for log retention
- ✅ **Troubleshooting** - Debug issues that occurred when you weren't watching

## 🛠️ Accessing Logs

### Runtime Logs
```bash
# Start development server to see runtime logs
npm run dev

# Output appears immediately in terminal:
# [nodemon] starting `ts-node src/app.ts`
# 2025-09-08 10:30:15:123 info: 🚀 Server running on port 3000
# POST /api/todos 201 25.123 ms - 273
```

### File Logs
```bash
# View today's logs in real-time
npm run logs

# View error logs only
npm run logs:error

# View all log files
npm run logs:all

# Manual file access
cat logs/app-2025-09-08.log
tail -f logs/app-2025-09-08.log

# Search and filter
grep "error" logs/app-2025-09-08.log
grep "req_1725789015123_abc123def" logs/app-2025-09-08.log
jq '.method == "POST"' logs/app-2025-09-08.log
```

## ⚙️ Technical Implementation

### Logger Configuration
```typescript
// src/loggers/logger.ts

// Console transport (runtime logs)
const consoleTransport = new winston.transports.Console({
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    winston.format.colorize({ all: true }),
    winston.format.printf(
      (info) => `${info.timestamp} ${info.level}: ${info.message}`
    )
  ),
});

// File transport (persistent logs)
const fileRotateTransport = new DailyRotateFile({
  filename: 'logs/app-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxFiles: '14d',
  maxSize: '20m',
  format: winston.format.json()
});

// Logger uses both transports conditionally
const logger = winston.createLogger({
  transports: [
    // Console only in development
    ...(process.env.NODE_ENV !== 'production' ? [consoleTransport] : []),
    // File always (both dev and prod)
    fileRotateTransport,
  ],
});
```

### Middleware Integration
```typescript
// src/app.ts

// Morgan integration (sends HTTP logs to Winston)
app.use(morgan('combined', {
  stream: {
    write: (message: string) => {
      logger.http(message.trim()); // Appears in both console and file
    }
  }
}));

// Custom request logger (detailed request/response tracking)
app.use(requestLogger); // Logs to both console and file
```

## 🔄 Log Flow Architecture

```
Request → Morgan → Winston HTTP Level → Both Console & File
       ↘ Custom Middleware → Winston Info/Warn/Error → Both Console & File
                          ↘ Error Handler → Winston Error → Both Console & File
```

### Three Logging Layers:
1. **Morgan** - Basic HTTP request logging
2. **Custom Request Logger** - Detailed request/response with correlation IDs
3. **Winston Core** - Application events, errors, and system messages

## 📁 File Organization

```
logs/
├── app-2025-09-08.log          # Today's application logs
├── app-2025-09-07.log          # Yesterday's logs
├── exceptions.log              # Uncaught exceptions
├── rejections.log              # Unhandled promise rejections
└── .audit.json                 # Winston rotation metadata
```

### Log Rotation
- **Daily rotation**: New file each day
- **Retention**: 14 days by default
- **Size limit**: 20MB per file
- **Automatic cleanup**: Old files deleted automatically

## 🌍 Environment Differences

### Development Mode
```bash
NODE_ENV=development npm run dev
```
- ✅ Console logs (colored, human-readable)
- ✅ File logs (structured JSON)
- ✅ Real-time feedback
- ✅ Debug level logs

### Production Mode
```bash
NODE_ENV=production npm start
```
- ❌ No console logs (cleaner output)
- ✅ File logs only (structured JSON)
- ✅ Performance optimized
- ✅ HTTP level and above only

## 🔍 Request Correlation

Both logging systems use **Request IDs** for correlation:

```json
// File log entry
{
  "requestId": "req_1725789015123_abc123def",
  "message": "Incoming POST /api/todos"
}

// Later in the same request
{
  "requestId": "req_1725789015123_abc123def", 
  "message": "Response 201 POST /api/todos"
}
```

### Tracing a Request
```bash
# Find all logs for a specific request
grep "req_1725789015123_abc123def" logs/app-2025-09-08.log

# Results show complete request lifecycle:
# 1. Incoming request with details
# 2. Any processing logs
# 3. Response with timing
# 4. Any errors that occurred
```

## 🚨 Error Handling

### Runtime Error Display
```bash
# Immediate error visibility in terminal
2025-09-08 10:30:15:123 error: Database connection failed
2025-09-08 10:30:15:124 warn: Response 500 POST /api/todos
```

### File Error Logging
```json
{
  "level": "error",
  "message": "Server Error", 
  "requestId": "req_1725789015123_abc123def",
  "errorType": "DATABASE_ERROR",
  "errorMessage": "Connection timeout",
  "stack": "Error: Connection timeout\n    at Database.connect...",
  "statusCode": 500,
  "timestamp": "2025-09-08T10:30:15.123Z"
}
```

## 💡 Best Practices

### Development Workflow
1. **Monitor runtime logs** for immediate feedback
2. **Check file logs** for detailed request tracing
3. **Use request IDs** to correlate across systems
4. **Search file logs** for historical debugging

### Production Workflow
1. **Monitor file logs** continuously
2. **Set up alerts** on error patterns
3. **Aggregate logs** to monitoring systems
4. **Regular log analysis** for performance insights

### Debugging Workflow
```bash
# 1. Notice issue in runtime logs
npm run dev
# See: "2025-09-08 10:30:15:123 warn: Response 400 POST /api/todos"

# 2. Find detailed information in file logs
npm run logs | grep "req_1725789015123_abc123def"
# Get: Full request details, validation errors, stack traces

# 3. Analyze patterns across multiple requests
grep "400" logs/app-2025-09-08.log | jq '.url' | sort | uniq -c
# Results: Which endpoints are failing most
```

## 🔧 Available NPM Scripts

```bash
# Logging scripts
npm run logs        # View today's logs in real-time
npm run logs:error  # View exception logs
npm run logs:all    # View all log files simultaneously

# Development
npm run dev         # Start with runtime logs visible

# Production
npm start          # Start with file logs only
```

## 📊 Log Analysis Examples

### Performance Analysis
```bash
# Find slow requests (>1000ms)
jq 'select(.responseTime and (.responseTime | ltrimstr("ms") | tonumber) > 1000)' logs/app-2025-09-08.log

# Most accessed endpoints
jq -r '.url' logs/app-2025-09-08.log | grep -v null | sort | uniq -c | sort -nr

# Error rate by hour
jq -r 'select(.level == "error") | .timestamp' logs/app-2025-09-08.log | cut -c12-13 | sort | uniq -c
```

### Security Analysis
```bash
# Failed authentication attempts
jq 'select(.statusCode == 401)' logs/app-2025-09-08.log

# Suspicious user agents
jq -r '.userAgent' logs/app-2025-09-08.log | grep -i bot | sort | uniq -c

# Large request bodies (potential attacks)
jq 'select(.body and (.body | length) > 10000)' logs/app-2025-09-08.log
```

## 🎯 Summary

The dual logging system provides the best of both worlds:

- **Runtime logs** give you immediate feedback during development
- **File logs** provide comprehensive historical data for production monitoring

Both systems work together to ensure you have visibility into your application's behavior in real-time and over time, making debugging, monitoring, and analysis much more effective.
