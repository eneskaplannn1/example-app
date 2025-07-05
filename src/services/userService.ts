import { supabase } from '../utils/supabase';

export async function updateUserExpoToken(userId: string, expoToken: string): Promise<void> {
  const { error } = await supabase
    .from('users')
    .update({ expo_push_token: expoToken })
    .eq('id', userId);

  if (error) {
    console.error('Error updating user expo token:', error);
    throw error;
  }
}

export async function getUserExpoToken(userId: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('users')
    .select('expo_push_token')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error getting user expo token:', error);
    return null;
  }

  return data?.expo_push_token || null;
}

export async function getAllUsersWithTokens(): Promise<{ id: string; expo_push_token: string }[]> {
  const { data, error } = await supabase
    .from('users')
    .select('id, expo_push_token')
    .not('expo_push_token', 'is', null);

  if (error) {
    console.error('Error getting users with tokens:', error);
    return [];
  }

  return data || [];
}
