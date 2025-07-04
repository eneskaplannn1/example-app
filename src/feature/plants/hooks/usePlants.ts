import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { getUserPlants } from '../services/userPlantService';
import { UserPlant } from '../../../types/userPlant';

export function usePlants() {
  const { user } = useAuth();
  const [userPlants, setUserPlants] = useState<UserPlant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPlants = useCallback(async () => {
    if (!user?.id) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const plants = await getUserPlants(user.id);
      setUserPlants(plants);
    } catch (err) {
      console.error('Error loading plants:', err);
      setError('Failed to load plants');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  const refreshData = useCallback(async () => {
    await loadPlants();
  }, [loadPlants]);

  useEffect(() => {
    loadPlants();
  }, [loadPlants]);

  return {
    userPlants,
    isLoading,
    error,
    refreshData,
  };
}
