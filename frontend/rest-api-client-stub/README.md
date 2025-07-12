# REST API Client Demo - Starting Point

A basic TypeScript REST API client stub that serves as a starting point for demonstrating modern web development practices with Cursor AI.

## Current Features

- **Basic TypeScript Integration**: Type definitions for API responses
- **Simple CRUD Operations**: Basic Create, Read, Update, Delete functionality
- **Real API Integration**: Uses JSONPlaceholder API for realistic data
- **React Web Interface**: Basic UI for testing API operations
- **Basic Error Handling**: Simple try/catch error handling

## Features to Add (Perfect for Cursor Demo)

- **Advanced Error Handling**: Custom error types and structured error responses
- **Automatic Retries**: Exponential backoff retry logic for failed requests
- **Response Caching**: In-memory caching with configurable TTL
- **Loading States**: Better UX with loading indicators
- **Optimistic Updates**: Immediate UI updates with rollback on failure
- **Request Cancellation**: Ability to cancel in-flight requests

## Demo API

This client integrates with [JSONPlaceholder](https://jsonplaceholder.typicode.com/), a free fake REST API for testing and prototyping.

### Available Endpoints

- `GET /posts` - Retrieve all posts
- `GET /posts/{id}` - Retrieve a specific post
- `POST /posts` - Create a new post
- `PUT /posts/{id}` - Update a post
- `DELETE /posts/{id}` - Delete a post
- `GET /users` - Retrieve all users
- `GET /users/{id}` - Retrieve a specific user
- `GET /comments` - Retrieve all comments

## Quick Start

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## API Client Usage

### Basic Usage

```typescript
import { ApiClient } from './client/apiClient';

const client = new ApiClient();

// Get all posts
try {
  const posts = await client.getPosts();
  console.log('Posts:', posts);
} catch (error) {
  console.error('Error loading posts:', error);
}

// Create a new post
try {
  const newPost = await client.createPost({
    title: 'My New Post',
    body: 'This is the content of my post.',
    userId: 1
  });
  console.log('Created post:', newPost);
} catch (error) {
  console.error('Error creating post:', error);
}
```

### Current Error Handling

```typescript
// Basic try/catch error handling
try {
  const post = await client.getPost(999);
  console.log('Post:', post);
} catch (error) {
  console.error('Failed to load post:', error);
}
```

## Areas for Enhancement (Demo Opportunities)

### Add Advanced Error Handling
- **Custom error types**: Create `ApiError` interface with status, message, and timestamp
- **Structured responses**: Wrap responses in `ApiResponse<T>` type
- **HTTP status handling**: Properly handle 4xx and 5xx response codes
- **User-friendly messages**: Transform technical errors into readable messages

### Implement Caching Strategy
- **In-memory caching**: Cache responses for better performance
- **Cache invalidation**: Clear related cache entries on write operations
- **TTL management**: Implement configurable time-to-live for cache entries

### Add Retry Logic
- **Exponential backoff**: Implement progressive delays between retries
- **Configurable retries**: Allow customization of retry attempts
- **Network error handling**: Automatic retry for network-related failures

## Cursor Demo Points

This project serves as an ideal starting point for demonstrating Cursor's capabilities:

1. **Advanced Error Handling**: Add structured error types and response wrappers
2. **Caching Implementation**: Implement in-memory caching with TTL and invalidation
3. **Retry Logic**: Add exponential backoff retry mechanism for failed requests
4. **Loading States**: Enhance UI with better loading indicators and states
5. **Type Safety**: Extend TypeScript usage with generics and advanced patterns
6. **Component Enhancement**: Improve React components with advanced patterns
7. **Code Refactoring**: Transform basic implementation into production-ready code