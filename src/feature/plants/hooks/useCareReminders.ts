import { useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { getCareReminders } from '../../../services/careReminderService';
import { CareReminder } from '../../../types/careReminder';
import { useQuery } from '@tanstack/react-query';

export function useCareReminders() {
  const { user } = useAuth();

  const {
    data: careReminders = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['careReminders', user?.id],
    queryFn: async (): Promise<CareReminder[]> => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }
      return await getCareReminders(user.id);
    },
    enabled: !!user?.id,
  });

  const refreshData = useCallback(async () => {
    await refetch();
  }, [refetch]);

  return {
    careReminders,
    isLoading,
    error: error?.message || null,
    refreshData,
  };
}
