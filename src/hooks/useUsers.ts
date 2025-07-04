import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserService, userKeys } from '../services/userService';
import { User, PaginationParams } from '../types/api';

// Hook to get current user profile
export const useCurrentUser = () => {
  return useQuery({
    queryKey: userKeys.profile(),
    queryFn: UserService.getCurrentUser,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to get user by ID
export const useUser = (id: string) => {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => UserService.getUserById(id),
    enabled: !!id,
  });
};

// Hook to get users with pagination
export const useUsers = (params?: PaginationParams) => {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => UserService.getUsers(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Hook to update user profile
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: UserService.updateProfile,
    onSuccess: (data) => {
      // Update the profile cache
      queryClient.setQueryData(userKeys.profile(), data);

      // Invalidate and refetch user lists
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
    onError: (error) => {
      console.error('Failed to update profile:', error);
    },
  });
};

// Hook to delete user account
export const useDeleteAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: UserService.deleteAccount,
    onSuccess: () => {
      // Clear all user-related cache
      queryClient.removeQueries({ queryKey: userKeys.all });
    },
    onError: (error) => {
      console.error('Failed to delete account:', error);
    },
  });
};
