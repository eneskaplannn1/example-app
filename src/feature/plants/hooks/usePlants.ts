import { useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { getUserPlants } from '../services/userPlantService';
import { UserPlant } from '../../../types/userPlant';
import { useQuery } from '@tanstack/react-query';
import { getPlants } from '../services';
import { Plant } from '~/src/types/plant';

export function useUserPlants() {
  const { user } = useAuth();

  const {
    data: userPlants = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['userPlants', user?.id],
    queryFn: async (): Promise<UserPlant[]> => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }
      return await getUserPlants(user.id);
    },
    enabled: !!user?.id,
  });

  const refreshData = useCallback(async () => {
    await refetch();
  }, [refetch]);

  return {
    userPlants,
    isLoading,
    error: error?.message || null,
    refreshData,
  };
}

export function usePlans() {
  return useQuery({
    queryKey: ['plans'],
    queryFn: async (): Promise<Plant[]> => {
      return await getPlants();
    },
  });
}
