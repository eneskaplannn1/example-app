import { supabase } from '../../../utils/supabase';
import { PlantIdentificationGuide } from '../../../types/plantIdentificationGuide';

export async function getPlantIdentificationGuides(
  plantId: string
): Promise<PlantIdentificationGuide[]> {
  const { data } = await supabase
    .from('plant_identification_guides')
    .select('*')
    .eq('plant_id', plantId);
  return data || [];
}

export async function getPlantIdentificationGuideById(
  id: string
): Promise<PlantIdentificationGuide | null> {
  const { data } = await supabase
    .from('plant_identification_guides')
    .select('*')
    .eq('id', id)
    .single();
  return data || null;
}

export async function addPlantIdentificationGuide(
  guide: Omit<PlantIdentificationGuide, 'id'>
): Promise<PlantIdentificationGuide | null> {
  const { data } = await supabase
    .from('plant_identification_guides')
    .insert([guide])
    .select()
    .single();
  return data || null;
}

export async function updatePlantIdentificationGuide(
  id: string,
  updates: Partial<PlantIdentificationGuide>
): Promise<PlantIdentificationGuide | null> {
  const { data } = await supabase
    .from('plant_identification_guides')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  return data || null;
}

export async function deletePlantIdentificationGuide(id: string): Promise<void> {
  await supabase.from('plant_identification_guides').delete().eq('id', id);
}
