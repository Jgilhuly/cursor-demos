# JWT Authentication System Demo

A minimal Express.js starter application that demonstrates the need for JWT authentication implementation. This project intentionally lacks proper authentication and authorization to showcase how development tools can help build secure authentication systems.

## Overview

This Express server provides several endpoints that should be protected but currently aren't. It's designed to be a starting point for implementing JWT-based authentication and authorization.

## What's Missing (Security Issues)

⚠️ **This application has intentional security vulnerabilities:**

1. **No JWT Implementation**: The login endpoint doesn't generate JWT tokens
2. **No Authentication Middleware**: Protected routes are accessible without authentication
3. **No Authorization**: Admin-only endpoints are accessible to all users
4. **Plaintext Passwords**: User passwords are stored in plaintext
5. **No Request Validation**: No input validation or sanitization
6. **Information Disclosure**: Secret data is exposed to all users

## Project Structure

```
jwt-auth-system/
├── server.js          # Main Express server with unprotected routes
├── config.js          # Configuration file (needs JWT_SECRET)
├── package.json       # Node.js dependencies
└── README.md         # This file
```

## Setup and Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the server:**
   ```bash
   npm start
   ```
   
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

3. **Access the application:**
   - Server runs on `http://localhost:3000`
   - Test endpoints using a tool like Postman or curl

## API Endpoints

### Public Endpoints
- `GET /` - Welcome message

### Authentication Endpoints
- `POST /login` - Login with username/password (⚠️ **No JWT generation**)

### Protected Endpoints (⚠️ **Currently Unprotected**)
- `GET /profile` - Get user profile (should require authentication)
- `GET /users` - List all users (should require admin role)
- `GET /secret-data` - Get sensitive data (should require authentication)
- `PUT /profile` - Update user profile (should require authentication)
- `DELETE /users/:id` - Delete user (should require admin role)

## Test Users

The application includes mock users for testing:

```json
[
  { "username": "admin", "password": "password123", "email": "admin@example.com" },
  { "username": "user1", "password": "password123", "email": "user1@example.com" },
  { "username": "user2", "password": "password123", "email": "user2@example.com" }
]
```

## Example Requests

### Login (currently insecure)
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "password123"}'
```

### Access Protected Route (currently unprotected)
```bash
curl http://localhost:3000/secret-data
```

## What Needs to be Implemented

To make this application secure, you need to:

1. **Add JWT Dependencies**
   - Install `jsonwebtoken` and `bcryptjs`
   - Add JWT secret to configuration

2. **Implement Authentication**
   - Hash passwords using bcrypt
   - Generate JWT tokens on successful login
   - Create authentication middleware

3. **Add Authorization**
   - Create role-based access control
   - Implement middleware for admin-only routes

4. **Secure Endpoints**
   - Protect all routes that should require authentication
   - Add request validation and sanitization

5. **Improve Security**
   - Add rate limiting
   - Implement proper error handling
   - Add HTTPS support

## Learning Goals

This project demonstrates:
- Building Express.js REST APIs
- Understanding authentication vs authorization
- Implementing JWT token-based authentication
- Creating secure middleware patterns
- Following security best practices
