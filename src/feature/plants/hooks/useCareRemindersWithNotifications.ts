import { useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';
import {
  getCareReminders,
  addCareReminder,
  deleteCareReminder,
} from '../../../services/careReminderService';
import { CareReminder } from '../../../types/careReminder';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '../../../services/notificationService';

export function useCareRemindersWithNotifications() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

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

  const createReminderMutation = useMutation({
    mutationFn: async ({
      reminder,
      plantName,
    }: {
      reminder: Omit<CareReminder, 'id'>;
      plantName?: string;
    }) => {
      return await addCareReminder(reminder, plantName);
    },
    onSuccess: () => {
      // Invalidate and refetch care reminders
      queryClient.invalidateQueries({ queryKey: ['careReminders'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  const deleteReminderMutation = useMutation({
    mutationFn: async (reminderId: string) => {
      await deleteCareReminder(reminderId);
      return reminderId;
    },
    onSuccess: (reminderId) => {
      // Cancel the scheduled notification
      notificationService.cancelNotification(reminderId);
      // Invalidate and refetch care reminders
      queryClient.invalidateQueries({ queryKey: ['careReminders'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  const refreshData = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const createReminder = useCallback(
    async (reminder: Omit<CareReminder, 'id'>, plantName?: string) => {
      return await createReminderMutation.mutateAsync({ reminder, plantName });
    },
    [createReminderMutation]
  );

  const deleteReminder = useCallback(
    async (reminderId: string) => {
      return await deleteReminderMutation.mutateAsync(reminderId);
    },
    [deleteReminderMutation]
  );

  return {
    careReminders,
    isLoading,
    error: error?.message || null,
    refreshData,
    createReminder,
    deleteReminder,
    isCreating: createReminderMutation.isPending,
    isDeleting: deleteReminderMutation.isPending,
  };
}
