import { supabase } from '../../../utils/supabase';
import { UserPlant } from '../../../types/userPlant';

// Debug function to test basic query
export async function debugUserPlants(userId: string) {
  console.log('Debug: Testing user plants query for user:', userId);

  // Test 1: Basic query without any filters
  const { data: allData, error: allError } = await supabase.from('user_plants').select('*');

  console.log('Debug: All user plants:', { data: allData, error: allError });

  // Test 2: Query with user_id filter
  const { data: userData, error: userError } = await supabase
    .from('user_plants')
    .select('*')
    .eq('user_id', userId);

  console.log('Debug: User plants for specific user:', { data: userData, error: userError });

  // Test 3: Check if the user_id format matches
  console.log('Debug: User ID type and value:', typeof userId, userId);

  // Test 4: Try with different user_id formats
  const { data: stringData, error: stringError } = await supabase
    .from('user_plants')
    .select('*')
    .eq('user_id', userId.toString());

  console.log('Debug: User plants with string conversion:', {
    data: stringData,
    error: stringError,
  });

  return { data: userData, error: userError };
}

export async function getUserPlants(userId: string): Promise<UserPlant[]> {
  try {
    console.log('getUserPlants called with userId:', userId);

    // First, let's try the simple query to see if we get the basic data
    const { data: userPlantsData, error: userPlantsError } = await supabase
      .from('user_plants')
      .select('*')
      .eq('user_id', userId);

    console.log('getUserPlants - userPlantsData:', userPlantsData);
    console.log('getUserPlants - userPlantsError:', userPlantsError);

    if (userPlantsError) {
      console.error('Error fetching user plants:', userPlantsError);
      return [];
    }

    if (!userPlantsData || userPlantsData.length === 0) {
      console.log('No user plants found for user:', userId);
      return [];
    }

    // Now let's try to get the plant details for each user plant
    const plantIds = userPlantsData.map((up) => up.plant_id);
    console.log('Plant IDs to fetch:', plantIds);

    const { data: plantsData, error: plantsError } = await supabase
      .from('plants')
      .select('*')
      .in('id', plantIds);

    console.log('getUserPlants - plantsData:', plantsData);
    console.log('getUserPlants - plantsError:', plantsError);

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

    console.log('getUserPlants - final result:', result);
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
