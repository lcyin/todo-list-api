## Authentication & Security Features

The application implements a comprehensive JWT-based authentication system with enterprise-grade security features.

### Authentication Flow

1. **User Registration**: Create account with email, password, and profile information
2. **Login**: Authenticate with email/password, receive JWT token
3. **Token-based Access**: Include JWT token in Authorization header for protected routes
4. **Profile Management**: Update user information and change passwords
5. **Token Verification**: Validate token integrity and expiration
6. **Logout**: Token blacklisting for secure logout (if implemented)

### Security Features

#### Password Security
- **BCrypt Hashing**: Industry-standard password hashing with configurable rounds
- **Password Strength Requirements**: Minimum 8 characters, uppercase, lowercase, and numbers
- **Secure Password Changes**: Require current password verification for changes

#### JWT Token Management
- **Configurable Expiration**: Set token lifetime (default 24 hours)
- **Secret Key Protection**: Environment-based JWT secret configuration
- **Token Validation**: Comprehensive token verification middleware
- **Authorization Headers**: Standard Bearer token authentication

#### Data Protection
- **Input Validation**: Comprehensive Zod schema validation for all auth endpoints
- **SQL Injection Prevention**: Parameterized queries with PostgreSQL
- **XSS Protection**: Input sanitization and validation
- **CORS Configuration**: Controlled cross-origin resource sharing

#### User Data Management
- **Unique Email Constraints**: Database-level uniqueness enforcement
- **Profile Updates**: Secure user information modification
- **Data Validation**: Email format, name length, and type validation
- **Error Handling**: Secure error responses without information leakage

### Authentication Endpoints

#### Registration
```bash
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### Login
```bash
POST /api/auth/login
{
  "email": "user@example.com", 
  "password": "SecurePass123"
}
```

#### Profile Management
```bash
# Get current user profile
GET /api/auth/profile
Authorization: Bearer <jwt_token>

# Update profile
PUT /api/auth/profile  
Authorization: Bearer <jwt_token>
{
  "firstName": "Jane",
  "email": "jane@example.com"
}

# Change password
PUT /api/auth/change-password
Authorization: Bearer <jwt_token>
{
  "currentPassword": "OldPass123",
  "newPassword": "NewSecurePass456"
}
```

### Protected Route Access

All todo endpoints require authentication:

```bash
# Example authenticated request
curl -H "Authorization: Bearer <your_jwt_token>" \
     -H "Content-Type: application/json" \
     http://localhost:3000/api/todos
```

### User-Todo Relationship

- **User Isolation**: Each user can only access their own todos
- **Automatic Association**: New todos are automatically linked to the authenticated user
- **Database Constraints**: Foreign key relationships ensure data integrity
- **Authorization Checks**: Middleware verifies user ownership for all operations