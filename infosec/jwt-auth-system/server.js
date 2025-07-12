const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Mock user data - in a real app this would be in a database
const users = [
  { id: 1, username: 'admin', email: 'admin@example.com', password: 'password123' },
  { id: 2, username: 'user1', email: 'user1@example.com', password: 'password123' },
  { id: 3, username: 'user2', email: 'user2@example.com', password: 'password123' }
];

// Mock sensitive data that should be protected
const secretData = [
  { id: 1, secret: 'This is confidential information for user 1' },
  { id:2, secret: 'This is confidential information for user 2' },
  { id: 3, secret: 'This is confidential information for user 3' }
];

// Public routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the JWT Auth System Demo!' });
});

// Login endpoint - currently returns user data without proper authentication
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  // TODO: Implement proper authentication
  // This is insecure - we're just checking if user exists
  const user = users.find(u => u.username === username && u.password === password);
  
  if (user) {
    // TODO: Generate and return JWT token
    res.json({ 
      message: 'Login successful',
      user: { id: user.id, username: user.username, email: user.email }
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Protected routes - these should require authentication but don't
app.get('/profile', (req, res) => {
  // TODO: Verify JWT token and get user from token
  // For now, just return first user's data
  const user = users[0];
  res.json({ 
    id: user.id, 
    username: user.username, 
    email: user.email 
  });
});

app.get('/users', (req, res) => {
  // TODO: Verify JWT token and check if user is admin
  // This endpoint should only be accessible to admin users
  res.json(users.map(user => ({
    id: user.id,
    username: user.username,
    email: user.email
  })));
});

app.get('/secret-data', (req, res) => {
  // TODO: Verify JWT token and return data for authenticated user only
  // Currently returns all secret data - this is a security vulnerability
  res.json(secretData);
});

app.put('/profile', (req, res) => {
  // TODO: Verify JWT token and update only the authenticated user's profile
  const { email } = req.body;
  res.json({ message: 'Profile updated successfully', email });
});

app.delete('/users/:id', (req, res) => {
  // TODO: Verify JWT token and check if user is admin
  // This endpoint should only be accessible to admin users
  const userId = parseInt(req.params.id);
  res.json({ message: `User ${userId} deleted successfully` });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to get started`);
});
