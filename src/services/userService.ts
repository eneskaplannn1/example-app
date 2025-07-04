import customRequest from '../utils/customRequest';
import { ApiResponse, User, PaginatedResponse, PaginationParams } from '../types/api';

// User service class
export class UserService {
  // Get current user profile
  static async getCurrentUser(): Promise<ApiResponse<User>> {
    const response = await customRequest.get('/user/profile');
    return response.data;
  }

  // Get user by ID
  static async getUserById(id: string): Promise<ApiResponse<User>> {
    const response = await customRequest.get(`/users/${id}`);
    return response.data;
  }

  // Get users with pagination
  static async getUsers(params?: PaginationParams): Promise<PaginatedResponse<User>> {
    const response = await customRequest.get('/users', { params });
    return response.data;
  }

  // Update user profile
  static async updateProfile(data: Partial<User>): Promise<ApiResponse<User>> {
    const response = await customRequest.put('/user/profile', data);
    return response.data;
  }

  // Delete user account
  static async deleteAccount(): Promise<ApiResponse<void>> {
    const response = await customRequest.delete('/user/account');
    return response.data;
  }
}

// React Query hooks for user operations
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (params?: PaginationParams) => [...userKeys.lists(), params] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
  profile: () => [...userKeys.all, 'profile'] as const,
};
