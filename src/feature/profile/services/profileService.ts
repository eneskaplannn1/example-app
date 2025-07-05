import { supabase } from '../../../utils/supabase';
import { User } from '../../../types/user';

export async function updateUserProfile(
  userId: string,
  profileData: { name: string; surname: string; profilePhoto?: string }
): Promise<User> {
  // Update user metadata in Supabase auth
  const { data, error } = await supabase.auth.updateUser({
    data: {
      name: profileData.name,
      surname: profileData.surname,
      profile_photo: profileData.profilePhoto,
    },
  });

  if (error) {
    console.error('Error updating user profile:', error);
    throw new Error('Failed to update profile');
  }

  if (!data.user) {
    throw new Error('No user data returned');
  }

  // Return the updated user data in the expected format
  return {
    id: data.user.id,
    email: data.user.email || '',
    name: data.user.user_metadata?.name || '',
    surname: data.user.user_metadata?.surname,
    profile_photo: data.user.user_metadata?.profile_photo,
  };
}

export async function changeUserPassword(
  userId: string,
  passwordData: { currentPassword: string; newPassword: string }
): Promise<void> {
  // Get current user to get their email
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    throw new Error('User email not found');
  }

  // First, verify the current password
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email,
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

  // Delete feature requests
  const { error: featureRequestsError } = await supabase
    .from('feature_requests')
    .delete()
    .eq('user_id', userId);

  if (featureRequestsError) {
    console.error('Error deleting feature requests:', featureRequestsError);
  }

  // Delete feature request votes
  const { error: votesError } = await supabase
    .from('feature_request_votes')
    .delete()
    .eq('user_id', userId);

  if (votesError) {
    console.error('Error deleting feature request votes:', votesError);
  }

  // Delete care reminders
  const { error: remindersError } = await supabase
    .from('care_reminders')
    .delete()
    .eq('user_id', userId);

  if (remindersError) {
    console.error('Error deleting care reminders:', remindersError);
  }

  // Delete weather alerts
  const { error: weatherAlertsError } = await supabase
    .from('weather_alerts')
    .delete()
    .eq('user_id', userId);

  if (weatherAlertsError) {
    console.error('Error deleting weather alerts:', weatherAlertsError);
  }

  // Delete the auth user (this will also delete any custom user data)
  const { error: authError } = await supabase.auth.admin.deleteUser(userId);

  if (authError) {
    console.error('Error deleting auth user:', authError);
    // Note: This might fail if we don't have admin privileges
    // In a real app, you'd handle this through a backend service
    throw new Error('Failed to delete user account');
  }
}
