import axios from 'axios';
import {
  Post,
  User,
  AIClassification,
  CreatePostRequest,
  ClassifyPostRequest,
  CreateUserRequest,
  AddReactionRequest,
  AddCommentRequest,
  RSVPRequest,
} from '../types';

// Configure axios defaults
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for cookie-based sessions
  headers: {
    'Content-Type': 'application/json',
  },
});

// API Response wrapper
interface ApiResponse<T> {
  data: T;
  message?: string;
}

// Error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// User API
export const userApi = {
  // Create or get user session
  createSession: async (userData: CreateUserRequest): Promise<User> => {
    const response = await api.post<User>('/users/session', userData);
    return response.data;
  },

  // Get current user
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<User>('/users/me');
    return response.data;
  },

  // Update user
  updateUser: async (userData: Partial<CreateUserRequest>): Promise<User> => {
    const response = await api.put<User>('/users/me', userData);
    return response.data;
  },

  // Logout
  logout: async (): Promise<void> => {
    await api.post('/users/logout');
  },
};

// AI API
export const aiApi = {
  // Classify post from user input
  classifyPost: async (request: ClassifyPostRequest): Promise<AIClassification> => {
    const response = await api.post<AIClassification>('/ai/classify-post', request);
    return response.data;
  },

  // Enhance post (optional feature)
  enhancePost: async (postData: any): Promise<any> => {
    const response = await api.post('/ai/enhance-post', postData);
    return response.data;
  },
};

// Posts API
export const postsApi = {
  // Get all posts (feed)
  getAllPosts: async (): Promise<Post[]> => {
    const response = await api.get<Post[]>('/posts');
    return response.data;
  },

  // Get specific post
  getPost: async (postId: string): Promise<Post> => {
    const response = await api.get<Post>(`/posts/${postId}`);
    return response.data;
  },

  // Create new post
  createPost: async (postData: CreatePostRequest): Promise<Post> => {
    const response = await api.post<Post>('/posts', postData);
    return response.data;
  },

  // Update post
  updatePost: async (postId: string, postData: Partial<CreatePostRequest>): Promise<Post> => {
    const response = await api.put<Post>(`/posts/${postId}`, postData);
    return response.data;
  },

  // Add reaction to post
  addReaction: async (postId: string, reactionData: AddReactionRequest): Promise<Post> => {
    const response = await api.post<Post>(`/posts/${postId}/reactions`, reactionData);
    return response.data;
  },

  // Add comment to post
  addComment: async (postId: string, commentData: AddCommentRequest): Promise<Post> => {
    const response = await api.post<Post>(`/posts/${postId}/comments`, commentData);
    return response.data;
  },

  // Add reply to comment
  addReply: async (postId: string, commentId: string, replyData: AddCommentRequest): Promise<Post> => {
    const response = await api.post<Post>(`/posts/${postId}/comments/${commentId}/replies`, replyData);
    return response.data;
  },

  // RSVP to event
  rsvpToEvent: async (postId: string, rsvpData: RSVPRequest): Promise<Post> => {
    const response = await api.post<Post>(`/posts/${postId}/rsvp`, rsvpData);
    return response.data;
  },
};

// Health check
export const healthApi = {
  check: async (): Promise<{ message: string; timestamp: string }> => {
    const response = await api.get('/health');
    return response.data;
  },
};

export default api;
