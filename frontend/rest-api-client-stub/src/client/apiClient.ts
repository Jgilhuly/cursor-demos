import type { 
  Post, 
  User, 
  Comment, 
  ApiError, 
  ApiResponse, 
  CreatePostData, 
  UpdatePostData 
} from '../types/api';

export class ApiClient {
  private baseUrl: string;
  private cache: Map<string, { data: unknown; timestamp: number }> = new Map();
  private cacheTimeout: number = 5 * 60 * 1000; // 5 minutes

  constructor(baseUrl: string = 'https://jsonplaceholder.typicode.com') {
    this.baseUrl = baseUrl;
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private getCacheKey(endpoint: string, params?: Record<string, unknown>): string {
    const paramString = params ? JSON.stringify(params) : '';
    return `${endpoint}${paramString}`;
  }

  private getFromCache<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data as T;
    }
    return null;
  }

  private setCache<T>(key: string, data: T): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  private async fetchWithRetry<T>(
    url: string,
    options: RequestInit = {},
    retries: number = 3
  ): Promise<ApiResponse<T>> {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, options);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return { data };
      } catch (error) {
        if (i === retries - 1) {
          const apiError: ApiError = {
            message: error instanceof Error ? error.message : 'Unknown error',
            status: 0,
            timestamp: new Date()
          };
          return { data: null as T, error: apiError };
        }
        
        await this.delay(Math.pow(2, i) * 1000); // Exponential backoff
      }
    }

    const apiError: ApiError = {
      message: 'Max retries exceeded',
      status: 0,
      timestamp: new Date()
    };
    return { data: null as T, error: apiError };
  }

  async getPosts(): Promise<ApiResponse<Post[]>> {
    const cacheKey = this.getCacheKey('/posts');
    const cached = this.getFromCache<Post[]>(cacheKey);
    
    if (cached) {
      return { data: cached, cached: true };
    }

    const result = await this.fetchWithRetry<Post[]>(`${this.baseUrl}/posts`);
    
    if (result.data && !result.error) {
      this.setCache(cacheKey, result.data);
    }
    
    return result;
  }

  async getPost(id: number): Promise<ApiResponse<Post>> {
    const cacheKey = this.getCacheKey(`/posts/${id}`);
    const cached = this.getFromCache<Post>(cacheKey);
    
    if (cached) {
      return { data: cached, cached: true };
    }

    const result = await this.fetchWithRetry<Post>(`${this.baseUrl}/posts/${id}`);
    
    if (result.data && !result.error) {
      this.setCache(cacheKey, result.data);
    }
    
    return result;
  }

  async createPost(postData: CreatePostData): Promise<ApiResponse<Post>> {
    const result = await this.fetchWithRetry<Post>(`${this.baseUrl}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    });

    if (result.data && !result.error) {
      this.cache.delete(this.getCacheKey('/posts'));
    }

    return result;
  }

  async updatePost(id: number, postData: UpdatePostData): Promise<ApiResponse<Post>> {
    const result = await this.fetchWithRetry<Post>(`${this.baseUrl}/posts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...postData, id }),
    });

    if (result.data && !result.error) {
      this.cache.delete(this.getCacheKey(`/posts/${id}`));
      this.cache.delete(this.getCacheKey('/posts'));
    }

    return result;
  }

  async deletePost(id: number): Promise<ApiResponse<void>> {
    const result = await this.fetchWithRetry<void>(`${this.baseUrl}/posts/${id}`, {
      method: 'DELETE',
    });

    if (!result.error) {
      this.cache.delete(this.getCacheKey(`/posts/${id}`));
      this.cache.delete(this.getCacheKey('/posts'));
    }

    return result;
  }

  async getUsers(): Promise<ApiResponse<User[]>> {
    const cacheKey = this.getCacheKey('/users');
    const cached = this.getFromCache<User[]>(cacheKey);
    
    if (cached) {
      return { data: cached, cached: true };
    }

    const result = await this.fetchWithRetry<User[]>(`${this.baseUrl}/users`);
    
    if (result.data && !result.error) {
      this.setCache(cacheKey, result.data);
    }
    
    return result;
  }

  async getUser(id: number): Promise<ApiResponse<User>> {
    const cacheKey = this.getCacheKey(`/users/${id}`);
    const cached = this.getFromCache<User>(cacheKey);
    
    if (cached) {
      return { data: cached, cached: true };
    }

    const result = await this.fetchWithRetry<User>(`${this.baseUrl}/users/${id}`);
    
    if (result.data && !result.error) {
      this.setCache(cacheKey, result.data);
    }
    
    return result;
  }

  async getComments(postId?: number): Promise<ApiResponse<Comment[]>> {
    const endpoint = postId ? `/posts/${postId}/comments` : '/comments';
    const cacheKey = this.getCacheKey(endpoint);
    const cached = this.getFromCache<Comment[]>(cacheKey);
    
    if (cached) {
      return { data: cached, cached: true };
    }

    const result = await this.fetchWithRetry<Comment[]>(`${this.baseUrl}${endpoint}`);
    
    if (result.data && !result.error) {
      this.setCache(cacheKey, result.data);
    }
    
    return result;
  }

  clearCache(): void {
    this.cache.clear();
  }

  getCacheSize(): number {
    return this.cache.size;
  }
} 