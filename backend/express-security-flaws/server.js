const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Hard-coded admin credentials (Security Flaw #1)
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'password123';
const API_KEY = 'sk-1234567890abcdef';

// Mock database (in-memory)
let users = [
  { id: 1, username: 'john_doe', email: 'john@example.com', role: 'user', password: 'user123' },
  { id: 2, username: 'jane_smith', email: 'jane@example.com', role: 'user', password: 'mypassword' },
  { id: 3, username: 'admin', email: 'admin@company.com', role: 'admin', password: 'password123' }
];

// Vulnerable session configuration (Security Flaw #2)
app.use(session({
  secret: 'weak-secret-key', // Hard-coded weak secret
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // No HTTPS enforcement
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static('public'));

// Set EJS as view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// Vulnerable authentication middleware (Security Flaw #3)
function requireAuth(req, res, next) {
  // Easily bypassable authentication check
  if (req.session.user || req.headers['x-admin-key'] === API_KEY) {
    next();
  } else {
    res.redirect('/login');
  }
}

// Routes
app.get('/', (req, res) => {
  res.render('index', { user: req.session.user });
});

app.get('/login', (req, res) => {
  res.render('login', { error: null });
});

// Vulnerable login endpoint (Security Flaw #4)
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  // No input sanitization, vulnerable to injection
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    req.session.user = { username: username, role: 'admin' };
    res.redirect('/dashboard');
  } else {
    // Check against user database with vulnerable query simulation
    const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
    console.log('Executing vulnerable query:', query); // This simulates SQL injection
    
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      req.session.user = { username: user.username, role: user.role };
      res.redirect('/dashboard');
    } else {
      res.render('login', { error: 'Invalid credentials' });
    }
  }
});

app.get('/dashboard', requireAuth, (req, res) => {
  res.render('dashboard', { user: req.session.user, users: users });
});

// Vulnerable user search (Security Flaw #5 - SQL Injection)
app.get('/users/search', (req, res) => {
  const { q } = req.query;
  
  if (!q) {
    return res.json([]);
  }
  
  // Simulate SQL injection vulnerability
  const vulnerableQuery = `SELECT * FROM users WHERE username LIKE '%${q}%' OR email LIKE '%${q}%'`;
  console.log('Vulnerable search query:', vulnerableQuery);
  
  // This simulates what would happen with real SQL injection
  if (q.includes("' OR '1'='1")) {
    console.log('SQL INJECTION DETECTED! Returning all users...');
    return res.json(users);
  }
  
  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(q.toLowerCase()) ||
    user.email.toLowerCase().includes(q.toLowerCase())
  );
  
  res.json(filteredUsers);
});

// Vulnerable user creation (Security Flaw #6 - XSS)
app.post('/users', (req, res) => {
  const { username, email, role } = req.body;
  
  // No input sanitization - vulnerable to XSS
  const newUser = {
    id: users.length + 1,
    username: username, // Could contain <script> tags
    email: email, // Could contain malicious HTML
    role: role || 'user',
    password: 'defaultpass123'
  };
  
  users.push(newUser);
  res.redirect('/dashboard');
});

// Vulnerable user update (Security Flaw #7)
app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const { username, email, role } = req.body;
  
  const userIndex = users.findIndex(u => u.id == id);
  if (userIndex !== -1) {
    // No authorization check - any user can update any user
    // No input sanitization
    users[userIndex] = {
      ...users[userIndex],
      username: username || users[userIndex].username,
      email: email || users[userIndex].email,
      role: role || users[userIndex].role
    };
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// Vulnerable file access (Security Flaw #8 - Directory Traversal)
app.get('/files/:filename', (req, res) => {
  const { filename } = req.params;
  
  // Directory traversal vulnerability
  const filePath = path.join(__dirname, 'public', filename);
  res.sendFile(filePath);
});

// Debug endpoint that exposes sensitive information (Security Flaw #9)
app.get('/debug', (req, res) => {
  res.json({
    environment: process.env,
    users: users,
    session: req.session,
    adminCredentials: { username: ADMIN_USERNAME, password: ADMIN_PASSWORD },
    apiKey: API_KEY
  });
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('WARNING: This application contains intentional security vulnerabilities for demonstration purposes.');
}); 