import { supabase } from '../utils/supabase';
import { CareReminder } from '../types/careReminder';

export async function getCareReminders(userId: string): Promise<CareReminder[]> {
  const { data } = await supabase
    .from('care_reminders')
    .select(
      `
      *,
      user_plants!inner(user_id)
    `
    )
    .eq('user_plants.user_id', userId);
  return data || [];
}

export async function getCareReminderById(id: string): Promise<CareReminder | null> {
  const { data } = await supabase.from('care_reminders').select('*').eq('id', id).single();
  return data || null;
}

export async function addCareReminder(
  reminder: Omit<CareReminder, 'id'>
): Promise<CareReminder | null> {
  const { data } = await supabase.from('care_reminders').insert([reminder]).select().single();
  return data || null;
}

export async function updateCareReminder(
  id: string,
  updates: Partial<CareReminder>
): Promise<CareReminder | null> {
  const { data } = await supabase
    .from('care_reminders')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  return data || null;
}

export async function deleteCareReminder(id: string): Promise<void> {
  await supabase.from('care_reminders').delete().eq('id', id);
}
