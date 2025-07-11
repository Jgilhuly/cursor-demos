# REST API Client Demo

A comprehensive TypeScript REST API client demonstrating modern web development practices including type safety, error handling, caching, and retry logic.

## Features

- **TypeScript Integration**: Full type safety with interfaces for all API responses
- **Error Handling**: Comprehensive error handling with custom error types
- **Automatic Retries**: Exponential backoff retry logic for failed requests
- **Response Caching**: In-memory caching with configurable TTL (5 minutes)
- **CRUD Operations**: Complete Create, Read, Update, Delete functionality
- **Real API Integration**: Uses JSONPlaceholder API for realistic data
- **React Web Interface**: Interactive UI for testing all API operations

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

## Project Structure

```
rest-api-client-stub/
├── src/
│   ├── client/
│   │   └── apiClient.ts      # Main API client with all HTTP methods
│   ├── components/
│   │   ├── ApiStats.tsx      # API statistics display
│   │   ├── PostForm.tsx      # Create post form
│   │   ├── PostList.tsx      # Display posts with actions
│   │   └── UserList.tsx      # Display users
│   ├── types/
│   │   └── api.ts            # TypeScript interfaces
│   ├── App.tsx               # Main application component
│   ├── App.css               # Application styles
│   └── main.tsx              # Application entry point
├── index.html                # HTML template
├── package.json              # Dependencies and scripts
└── README.md                 # This file
```

## API Client Usage

### Basic Usage

```typescript
import { ApiClient } from './client/apiClient';

const client = new ApiClient();

// Get all posts
const postsResponse = await client.getPosts();
if (postsResponse.error) {
  console.error('Error:', postsResponse.error.message);
} else {
  console.log('Posts:', postsResponse.data);
  console.log('From cache:', postsResponse.cached);
}

// Create a new post
const newPost = await client.createPost({
  title: 'My New Post',
  body: 'This is the content of my post.',
  userId: 1
});
```

### Error Handling

```typescript
const response = await client.getPost(999);
if (response.error) {
  console.error(`Error ${response.error.status}: ${response.error.message}`);
  console.error('Occurred at:', response.error.timestamp);
} else {
  console.log('Post:', response.data);
}
```

### Cache Management

```typescript
// Check cache size
console.log('Cache size:', client.getCacheSize());

// Clear cache
client.clearCache();
```

## Demo Instructions

### 1. View Posts
- Click "View Posts" to load all posts from the API
- Notice the loading state and error handling
- Try refreshing to see caching in action (subsequent loads will be faster)

### 2. View Users
- Click "View Users" to load user data
- Explore the detailed user information including address and company data

### 3. Create Post
- Click "Create Post" to access the creation form
- Fill in the title, body, and select a user
- Submit to create a new post (simulated - JSONPlaceholder returns a mock response)

### 4. Delete Posts
- In the posts view, click "Delete" on any post
- The post will be removed from the local state (simulated deletion)

### 5. Cache Management
- Click "Clear Cache" to reset the client's cache
- Notice how subsequent API calls will reload data instead of using cached responses

### 6. Error Simulation
- The client includes retry logic with exponential backoff
- Network errors are automatically retried up to 3 times
- All errors are displayed in the UI with detailed messages

## TypeScript Features

### Type Safety
All API responses are fully typed:

```typescript
interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

interface ApiResponse<T> {
  data: T;
  error?: ApiError;
  cached?: boolean;
}
```

### Generic Methods
The client uses TypeScript generics for type safety:

```typescript
private async fetchWithRetry<T>(
  url: string,
  options: RequestInit = {},
  retries: number = 3
): Promise<ApiResponse<T>>
```

## Advanced Features

### Caching Strategy
- **In-memory caching**: Responses are cached in memory for 5 minutes
- **Cache invalidation**: Write operations (POST, PUT, DELETE) clear related cache entries
- **Cache inspection**: View cache size and clear cache manually

### Retry Logic
- **Exponential backoff**: Delays between retries increase exponentially (1s, 2s, 4s)
- **Configurable retries**: Default 3 attempts, customizable per request
- **Error aggregation**: Final error includes all retry attempts

### Error Handling
- **Structured errors**: Custom `ApiError` type with status, message, and timestamp
- **Network errors**: Automatic retry for network-related failures
- **HTTP errors**: Proper handling of 4xx and 5xx response codes
- **User-friendly messages**: Clear error messages displayed in the UI

## Cursor Demo Points

This project demonstrates several key areas where Cursor excels:

1. **Type Generation**: Show how Cursor can generate TypeScript interfaces from API responses
2. **Error Handling**: Demonstrate Cursor's ability to add comprehensive error handling patterns
3. **Component Creation**: Use Cursor to quickly scaffold React components with proper TypeScript types
4. **API Integration**: Show how Cursor can help integrate with external APIs and handle async operations
5. **Code Refactoring**: Demonstrate Cursor's ability to refactor and improve existing code structure

## Technologies Used

- **TypeScript**: Full type safety and modern JavaScript features
- **React**: Component-based UI library
- **Vite**: Fast development server and build tool
- **JSONPlaceholder**: Free REST API for testing
- **CSS Grid/Flexbox**: Modern layout techniques
- **Fetch API**: Native browser HTTP client

## License

MIT License - feel free to use this project for learning and demonstration purposes.
