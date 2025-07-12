import type { 
  Post, 
  User, 
  Comment, 
  CreatePostData, 
  UpdatePostData 
} from '../types/api';

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = 'https://jsonplaceholder.typicode.com') {
    this.baseUrl = baseUrl;
  }

  async getPosts(): Promise<Post[]> {
    const response = await fetch(`${this.baseUrl}/posts`);
    return response.json();
  }

  async getPost(id: number): Promise<Post> {
    const response = await fetch(`${this.baseUrl}/posts/${id}`);
    return response.json();
  }

  async createPost(postData: CreatePostData): Promise<Post> {
    const response = await fetch(`${this.baseUrl}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    });
    return response.json();
  }

  async updatePost(id: number, postData: UpdatePostData): Promise<Post> {
    const response = await fetch(`${this.baseUrl}/posts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...postData, id }),
    });
    return response.json();
  }

  async deletePost(id: number): Promise<void> {
    await fetch(`${this.baseUrl}/posts/${id}`, {
      method: 'DELETE',
    });
  }

  async getUsers(): Promise<User[]> {
    const response = await fetch(`${this.baseUrl}/users`);
    return response.json();
  }

  async getUser(id: number): Promise<User> {
    const response = await fetch(`${this.baseUrl}/users/${id}`);
    return response.json();
  }

  async getComments(postId?: number): Promise<Comment[]> {
    const endpoint = postId ? `/posts/${postId}/comments` : '/comments';
    const response = await fetch(`${this.baseUrl}${endpoint}`);
    return response.json();
  }
} 