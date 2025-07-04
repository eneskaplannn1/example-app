import { useState, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { addUserPlant } from '../services/userPlantService';
import { getPlants } from '../services/plantService';
import { Plant } from '../../../types/plant';
import { UserPlant } from '../../../types/userPlant';

interface AddPlantData {
  plant_id: string;
  nickname: string;
  acquired_date: string;
  notes: string;
  image_url?: string;
}

export function useAddPlant() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availablePlants, setAvailablePlants] = useState<Plant[]>([]);
  const [isLoadingPlants, setIsLoadingPlants] = useState(false);

  const loadAvailablePlants = useCallback(async () => {
    if (!user?.id) return;

    try {
      setIsLoadingPlants(true);
      setError(null);
      const plants = await getPlants();
      setAvailablePlants(plants);
    } catch (err) {
      console.error('Error loading plants:', err);
      setError('Failed to load available plants');
    } finally {
      setIsLoadingPlants(false);
    }
  }, [user?.id]);

  const addPlant = useCallback(
    async (plantData: AddPlantData): Promise<UserPlant | null> => {
      if (!user?.id) {
        setError('User not authenticated');
        return null;
      }

      try {
        setIsLoading(true);
        setError(null);

        const newUserPlant: Omit<UserPlant, 'id'> = {
          user_id: user.id,
          plant_id: plantData.plant_id,
          nickname: plantData.nickname,
          acquired_date: plantData.acquired_date,
          last_watered: new Date().toISOString(),
          notes: plantData.notes,
          image_url: plantData.image_url,
        };

        const result = await addUserPlant(newUserPlant);
        return result;
      } catch (err) {
        console.error('Error adding plant:', err);
        setError('Failed to add plant');
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [user?.id]
  );

  return {
    addPlant,
    loadAvailablePlants,
    availablePlants,
    isLoading,
    isLoadingPlants,
    error,
    setError,
  };
}
