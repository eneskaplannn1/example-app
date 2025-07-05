import { useState, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { updateUserProfile, changeUserPassword } from '../services/profileService';

export function useProfile() {
  const { user, updateUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const updateProfile = useCallback(
    async (profileData: { name: string; surname: string; profilePhoto?: string }) => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      try {
        setIsLoading(true);
        const updatedUser = await updateUserProfile(user.id, profileData);
        updateUser(updatedUser);
      } catch (error) {
        console.error('Error updating profile:', error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [user?.id, updateUser]
  );

  const changePassword = useCallback(
    async (passwordData: { currentPassword: string; newPassword: string }) => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      try {
        setIsLoading(true);
        await changeUserPassword(user.id, passwordData);
      } catch (error) {
        console.error('Error changing password:', error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [user?.id]
  );

  return {
    updateProfile,
    changePassword,
    isLoading,
  };
}
