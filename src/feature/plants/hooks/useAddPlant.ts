import { useState, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { addUserPlant } from '../services/userPlantService';
import { UserPlant } from '../../../types/userPlant';
import { usePlans } from './usePlants';

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

  const { data: plans, isLoading: isLoadingPlants } = usePlans();

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
    plans,
    isLoading,
    isLoadingPlants,
    error,
    setError,
  };
}
