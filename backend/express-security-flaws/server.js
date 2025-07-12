const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Admin credentials
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'password123';
const API_KEY = 'sk-1234567890abcdef';

// Mock database (in-memory)
let users = [
  { id: 1, username: 'john_doe', email: 'john@example.com', role: 'user', password: 'user123' },
  { id: 2, username: 'jane_smith', email: 'jane@example.com', role: 'user', password: 'mypassword' },
  { id: 3, username: 'admin', email: 'admin@company.com', role: 'admin', password: 'password123' }
];

// Session configuration
app.use(session({
  secret: 'weak-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static('public'));

// Set EJS as view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// Authentication middleware
function requireAuth(req, res, next) {
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

// Login endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    req.session.user = { username: username, role: 'admin' };
    res.redirect('/dashboard');
  } else {
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

// User search
app.get('/users/search', (req, res) => {
  const { q } = req.query;
  
  if (!q) {
    return res.json([]);
  }
  
  if (q.includes("' OR '1'='1")) {
    return res.json(users);
  }
  
  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(q.toLowerCase()) ||
    user.email.toLowerCase().includes(q.toLowerCase())
  );
  
  res.json(filteredUsers);
});

// User creation
app.post('/users', (req, res) => {
  const { username, email, role } = req.body;
  
  const newUser = {
    id: users.length + 1,
    username: username,
    email: email,
    role: role || 'user',
    password: 'defaultpass123'
  };
  
  users.push(newUser);
  res.redirect('/dashboard');
});

// User update
app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const { username, email, role } = req.body;
  
  const userIndex = users.findIndex(u => u.id == id);
  if (userIndex !== -1) {
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

// File access
app.get('/files/:filename', (req, res) => {
  const { filename } = req.params;
  
  const filePath = path.join(__dirname, 'public', filename);
  res.sendFile(filePath);
});

// Debug endpoint
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
}); 