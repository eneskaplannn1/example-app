import { supabase } from '../utils/supabase';
import { WeatherAlert } from '../types/weatherAlert';

export async function getWeatherAlerts(userId: string): Promise<WeatherAlert[]> {
  const { data } = await supabase.from('weather_alerts').select('*').eq('user_id', userId);
  return data || [];
}

export async function getWeatherAlertById(id: string): Promise<WeatherAlert | null> {
  const { data } = await supabase.from('weather_alerts').select('*').eq('id', id).single();
  return data || null;
}

export async function addWeatherAlert(
  alert: Omit<WeatherAlert, 'id'>
): Promise<WeatherAlert | null> {
  const { data } = await supabase.from('weather_alerts').insert([alert]).select().single();
  return data || null;
}

export async function updateWeatherAlert(
  id: string,
  updates: Partial<WeatherAlert>
): Promise<WeatherAlert | null> {
  const { data } = await supabase
    .from('weather_alerts')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  return data || null;
}

export async function deleteWeatherAlert(id: string): Promise<void> {
  await supabase.from('weather_alerts').delete().eq('id', id);
}
