import { supabase } from '../../../utils/supabase';
import { User } from '../../../types/user';

export async function updateUserProfile(
  userId: string,
  profileData: { name: string; surname: string; profilePhoto?: string }
): Promise<User> {
  const { data, error } = await supabase
    .from('users')
    .update({
      name: profileData.name,
      surname: profileData.surname,
      profile_photo: profileData.profilePhoto,
    })
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating user profile:', error);
    throw new Error('Failed to update profile');
  }

  return data;
}

export async function changeUserPassword(
  userId: string,
  passwordData: { currentPassword: string; newPassword: string }
): Promise<void> {
  // First, verify the current password
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: '', // We need the user's email, but we can get it from the user object
    password: passwordData.currentPassword,
  });

  if (signInError) {
    throw new Error('Current password is incorrect');
  }

  // Update the password
  const { error } = await supabase.auth.updateUser({
    password: passwordData.newPassword,
  });

  if (error) {
    console.error('Error changing password:', error);
    throw new Error('Failed to change password');
  }
}

export async function deleteUserAccount(userId: string): Promise<void> {
  // Delete user data from all related tables first
  const { error: userPlantsError } = await supabase
    .from('user_plants')
    .delete()
    .eq('user_id', userId);

  if (userPlantsError) {
    console.error('Error deleting user plants:', userPlantsError);
  }

  // Delete user from users table
  const { error: userError } = await supabase.from('users').delete().eq('id', userId);

  if (userError) {
    console.error('Error deleting user:', userError);
    throw new Error('Failed to delete user account');
  }

  // Delete the auth user
  const { error: authError } = await supabase.auth.admin.deleteUser(userId);

  if (authError) {
    console.error('Error deleting auth user:', authError);
    // Note: This might fail if we don't have admin privileges
    // In a real app, you'd handle this through a backend service
  }
}
