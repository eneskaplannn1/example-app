import { useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { getUserPlants } from '../../plants';
import { getCareReminders } from '../../../services/careReminderService';
import { getWeatherAlerts } from '../../../services/weatherAlertService';
import { featureRequestService } from '../../../services/featureRequestService';
import { UserPlant } from '../../../types/userPlant';
import { CareReminder } from '../../../types/careReminder';
import { WeatherAlert } from '../../../types/weatherAlert';
import { FeatureRequest } from '../../../types/featureRequest';
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface DashboardStats {
  totalPlants: number;
  needsWatering: number;
  activeReminders: number;
  weatherAlerts: number;
}

interface DashboardData {
  userPlants: UserPlant[];
  careReminders: CareReminder[];
  weatherAlerts: WeatherAlert[];
  mostWantedRequests: FeatureRequest[];
  stats: DashboardStats;
}

export function useDashboard() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const calculateStats = useCallback(
    (plants: UserPlant[], reminders: CareReminder[], alerts: WeatherAlert[]) => {
      const needsWatering = plants.filter((plant) => {
        const lastWatered = new Date(plant.last_watered);
        const daysSinceWatering = Math.floor(
          (Date.now() - lastWatered.getTime()) / (1000 * 60 * 60 * 24)
        );
        return daysSinceWatering >= 7;
      }).length;

      return {
        totalPlants: plants.length,
        needsWatering,
        activeReminders: reminders.length,
        weatherAlerts: alerts.length,
      };
    },
    []
  );

  const {
    data: dashboardData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['dashboard', user?.id],
    queryFn: async (): Promise<DashboardData> => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      const [plants, reminders, alerts, mostWantedRequests] = await Promise.all([
        getUserPlants(user.id),
        getCareReminders(user.id),
        getWeatherAlerts(user.id),
        featureRequestService.getMostWantedRequests(5),
      ]);

      const stats = calculateStats(plants, reminders, alerts);

      return {
        userPlants: plants,
        careReminders: reminders,
        weatherAlerts: alerts,
        mostWantedRequests,
        stats,
      };
    },
    enabled: !!user?.id,
  });

  const refreshData = useCallback(async () => {
    await refetch();
    queryClient.invalidateQueries({ queryKey: ['dashboard', user?.id] });
  }, [refetch, user?.id, queryClient]);

  return {
    userPlants: dashboardData?.userPlants || [],
    careReminders: dashboardData?.careReminders || [],
    weatherAlerts: dashboardData?.weatherAlerts || [],
    mostWantedRequests: dashboardData?.mostWantedRequests || [],
    stats: dashboardData?.stats || {
      totalPlants: 0,
      needsWatering: 0,
      activeReminders: 0,
      weatherAlerts: 0,
    },
    isLoading,
    error: error?.message || null,
    refreshData,
  };
}
