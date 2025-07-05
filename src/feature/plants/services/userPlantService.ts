import { supabase } from '../../../utils/supabase';
import { UserPlant } from '../../../types/userPlant';

export async function getUserPlants(userId: string): Promise<UserPlant[]> {
  try {
    // First, let's try the simple query to see if we get the basic data
    const { data: userPlantsData, error: userPlantsError } = await supabase
      .from('user_plants')
      .select('*')
      .eq('user_id', userId);

    if (userPlantsError) {
      console.error('Error fetching user plants:', userPlantsError);
      return [];
    }

    if (!userPlantsData || userPlantsData.length === 0) {
      return [];
    }

    // Now let's try to get the plant details for each user plant
    const plantIds = userPlantsData.map((up) => up.plant_id);

    const { data: plantsData, error: plantsError } = await supabase
      .from('plants')
      .select('*')
      .in('id', plantIds);

    if (plantsError) {
      console.error('Error fetching plants:', plantsError);
      // Return user plants without plant details
      return userPlantsData.map((up) => ({
        ...up,
        plants: undefined,
      }));
    }

    // Create a map of plant data for quick lookup
    const plantsMap = new Map(plantsData?.map((p) => [p.id, p]) || []);

    // Combine user plants with plant details
    const result = userPlantsData.map((userPlant) => ({
      ...userPlant,
      plants: plantsMap.get(userPlant.plant_id),
    }));

    return result;
  } catch (error) {
    console.error('Unexpected error in getUserPlants:', error);
    return [];
  }
}

export async function getUserPlantById(id: string): Promise<UserPlant | null> {
  const { data } = await supabase.from('user_plants').select('*').eq('id', id).single();
  return data || null;
}

export async function addUserPlant(userPlant: Omit<UserPlant, 'id'>): Promise<UserPlant | null> {
  const { data } = await supabase.from('user_plants').insert([userPlant]).select().single();
  return data || null;
}

export async function updateUserPlant(
  id: string,
  updates: Partial<UserPlant>
): Promise<UserPlant | null> {
  const { data } = await supabase
    .from('user_plants')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  return data || null;
}

export async function deleteUserPlant(id: string): Promise<void> {
  await supabase.from('user_plants').delete().eq('id', id);
}

export async function waterPlant(id: string): Promise<UserPlant | null> {
  const { data } = await supabase
    .from('user_plants')
    .update({ last_watered: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  return data || null;
}
