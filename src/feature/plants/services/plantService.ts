import { supabase } from '../../../utils/supabase';
import { Plant } from '../../../types/plant';

export async function getPlants(): Promise<Plant[]> {
  const { data } = await supabase.from('plants').select('*');
  return data || [];
}

export async function getPlantById(id: string): Promise<Plant | null> {
  const { data } = await supabase.from('plants').select('*').eq('id', id).single();
  return data || null;
}

export async function addPlant(plant: Omit<Plant, 'id'>): Promise<Plant | null> {
  const { data } = await supabase.from('plants').insert([plant]).select().single();
  return data || null;
}

export async function updatePlant(id: string, updates: Partial<Plant>): Promise<Plant | null> {
  const { data } = await supabase.from('plants').update(updates).eq('id', id).select().single();
  return data || null;
}

export async function deletePlant(id: string): Promise<void> {
  await supabase.from('plants').delete().eq('id', id);
}
