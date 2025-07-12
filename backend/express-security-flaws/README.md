# Express Security Flaws Demo

⚠️ **WARNING: This application contains intentional security vulnerabilities for educational purposes only. DO NOT use this in production!**

## Overview

This is a deliberately vulnerable Express.js application designed to demonstrate common web application security flaws. It simulates a user management system with multiple security vulnerabilities that developers commonly encounter in real-world applications.

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the application:**
   ```bash
   npm start
   ```

3. **Access the application:**
   - Open your browser to `http://localhost:3000`
   - Login with admin credentials: `admin` / `password123`

## Security Vulnerabilities Included

### 1. Hard-coded Credentials
- **Location:** `server.js` lines 10-12
- **Issue:** Admin credentials are hard-coded in the source code
- **Exploit:** Credentials visible in source code
- **Demo:** Use `admin` / `password123` to login

### 2. Weak Session Configuration
- **Location:** `server.js` lines 23-28
- **Issue:** Weak session secret, insecure cookie settings
- **Exploit:** Session hijacking possible
- **Demo:** Check session configuration in developer tools

### 3. Authentication Bypass
- **Location:** `server.js` lines 35-41
- **Issue:** Authentication can be bypassed using HTTP headers
- **Exploit:** Add `X-Admin-Key: sk-1234567890abcdef` header to bypass auth
- **Demo:** 
  ```bash
  curl -H "X-Admin-Key: sk-1234567890abcdef" http://localhost:3000/dashboard
  ```

### 4. SQL Injection Simulation
- **Location:** `server.js` lines 60-65, 76-95
- **Issue:** User input directly concatenated into SQL queries
- **Exploit:** Inject SQL code through login form or search
- **Demo:** 
  - Login with username: `admin' OR '1'='1' --`
  - Search for: `' OR '1'='1`

### 5. Cross-Site Scripting (XSS)
- **Location:** `views/dashboard.ejs` lines 166-168
- **Issue:** User input displayed without sanitization
- **Exploit:** Insert malicious scripts through user creation
- **Demo:** 
  - Add user with username: `<script>alert('XSS')</script>`
  - Add user with username: `<img src=x onerror=alert('XSS')>`

### 6. No Input Sanitization
- **Location:** `server.js` lines 97-112
- **Issue:** User input not validated or sanitized
- **Exploit:** Malicious data can be stored and executed
- **Demo:** Create users with malicious payloads

### 7. Missing Authorization
- **Location:** `server.js` lines 114-133
- **Issue:** Any user can modify any other user's data
- **Exploit:** Users can elevate privileges or modify admin accounts
- **Demo:** Login as regular user and modify admin user data

### 8. Directory Traversal
- **Location:** `server.js` lines 135-142
- **Issue:** File access without proper path validation
- **Exploit:** Access files outside intended directory
- **Demo:** 
  ```bash
  curl http://localhost:3000/files/../server.js
  ```

### 9. Information Disclosure
- **Location:** `server.js` lines 144-153
- **Issue:** Debug endpoint exposes sensitive information
- **Exploit:** Sensitive data exposed to unauthorized users
- **Demo:** Visit `http://localhost:3000/debug`

## Test Scenarios

### SQL Injection Tests
1. **Login bypass:**
   - Username: `admin' OR '1'='1' --`
   - Password: anything
   
2. **Search injection:**
   - Search for: `' OR '1'='1`
   - Should return all users

### XSS Tests
1. **Stored XSS via user creation:**
   - Username: `<script>alert('Stored XSS')</script>`
   - Username: `<img src=x onerror=alert('Image XSS')>`
   
2. **Reflected XSS via search:**
   - Search: `<script>alert('Reflected XSS')</script>`

### Authentication Tests
1. **Hard-coded credentials:**
   - admin / password123
   - john_doe / user123
   
2. **API key bypass:**
   - Add header: `X-Admin-Key: sk-1234567890abcdef`

### Authorization Tests
1. **Privilege escalation:**
   - Login as regular user
   - Modify admin user data via PUT request

## File Structure

```
express-security-flaws/
├── server.js              # Main application with vulnerabilities
├── package.json           # Dependencies and scripts
├── views/                 # EJS templates
│   ├── index.ejs         # Home page
│   ├── login.ejs         # Login form
│   └── dashboard.ejs     # User management dashboard
├── public/               # Static files
│   └── style.css        # Additional styling
└── README.md            # This file
```

## API Endpoints

- `GET /` - Home page
- `GET /login` - Login form
- `POST /login` - Handle login (vulnerable to SQL injection)
- `GET /dashboard` - User management dashboard (requires auth)
- `GET /users/search` - Search users (vulnerable to SQL injection)
- `POST /users` - Create user (vulnerable to XSS)
- `PUT /users/:id` - Update user (no authorization check)
- `DELETE /users/:id` - Delete user (no authorization check)
- `GET /files/:filename` - File access (directory traversal)
- `GET /debug` - Debug info (information disclosure)
- `GET /logout` - Logout

## Educational Use

This application is perfect for:
- Security awareness training
- Penetration testing practice
- Understanding common web vulnerabilities
- Learning secure coding practices
- Demonstrating the impact of security flaws

## Security Best Practices (What NOT to do)

This application demonstrates what NOT to do:
- ❌ Never hard-code credentials
- ❌ Never trust user input without validation
- ❌ Never concatenate user input into queries
- ❌ Never display user input without sanitization
- ❌ Never expose debug information in production
- ❌ Never skip authorization checks
- ❌ Never use weak session configurations
- ❌ Never allow directory traversal in file access

## Remediation Examples

To fix these vulnerabilities, you would:
1. Use environment variables for secrets
2. Implement proper input validation and sanitization
3. Use parameterized queries or ORM
4. Implement proper authentication and authorization
5. Use secure session configuration
6. Validate file paths and restrict access
7. Remove or secure debug endpoints
8. Implement proper error handling

## License

This project is for educational purposes only. Use at your own risk.

---

**Remember: This application is intentionally vulnerable. Never deploy it to production or any publicly accessible environment!** 