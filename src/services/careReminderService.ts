import { supabase } from '../utils/supabase';
import { CareReminder } from '../types/careReminder';
import { getUserPlants } from '../feature/plants/services/userPlantService';
import { notificationService } from './notificationService';

export async function getCareReminders(userId: string): Promise<CareReminder[]> {
  try {
    // First get all user plants for this user
    const userPlants = await getUserPlants(userId);
    const userPlantIds = userPlants.map((plant) => plant.id);

    if (userPlantIds.length === 0) {
      return [];
    }

    // Then get all reminders for these plants
    const { data, error } = await supabase
      .from('care_reminders')
      .select('*')
      .in('user_plant_id', userPlantIds)
      .order('reminder_time');

    if (error) {
      console.error('Error fetching care reminders:', error);
      return [];
    }

    console.log('Fetched care reminders:', data);
    return data || [];
  } catch (error) {
    console.error('Error in getCareReminders:', error);
    return [];
  }
}

export async function getCareReminderById(id: string): Promise<CareReminder | null> {
  const { data } = await supabase.from('care_reminders').select('*').eq('id', id).single();
  return data || null;
}

export async function addCareReminder(
  reminder: Omit<CareReminder, 'id'>,
  plantName?: string
): Promise<CareReminder | null> {
  try {
    const { data, error } = await supabase
      .from('care_reminders')
      .insert([reminder])
      .select()
      .single();

    if (error) {
      console.error('Error adding care reminder:', error);
      return null;
    }

    if (data) {
      // Schedule notification for the reminder
      await notificationService.scheduleCareReminder({
        ...data,
        plantName,
      });
    }

    return data || null;
  } catch (error) {
    console.error('Error in addCareReminder:', error);
    return null;
  }
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

export async function getCareRemindersByPlant(userPlantId: string): Promise<CareReminder[]> {
  const { data } = await supabase
    .from('care_reminders')
    .select('*')
    .eq('user_plant_id', userPlantId)
    .order('reminder_time');
  return data || [];
}
