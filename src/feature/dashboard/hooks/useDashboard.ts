import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { getUserPlants, debugUserPlants } from '../../plants';
import { getCareReminders } from '../../../services/careReminderService';
import { getWeatherAlerts } from '../../../services/weatherAlertService';
import { featureRequestService } from '../../../services/featureRequestService';
import { UserPlant } from '../../../types/userPlant';
import { CareReminder } from '../../../types/careReminder';
import { WeatherAlert } from '../../../types/weatherAlert';
import { FeatureRequest } from '../../../types/featureRequest';

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
  const [data, setData] = useState<DashboardData>({
    userPlants: [],
    careReminders: [],
    weatherAlerts: [],
    mostWantedRequests: [],
    stats: {
      totalPlants: 0,
      needsWatering: 0,
      activeReminders: 0,
      weatherAlerts: 0,
    },
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const loadDashboardData = useCallback(async () => {
    if (!user?.id) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Debug the basic query first
      await debugUserPlants(user.id);

      const [plants, reminders, alerts, mostWantedRequests] = await Promise.all([
        getUserPlants(user.id),
        getCareReminders(user.id),
        getWeatherAlerts(user.id),
        featureRequestService.getMostWantedRequests(5),
      ]);

      const stats = calculateStats(plants, reminders, alerts);

      setData({
        userPlants: plants,
        careReminders: reminders,
        weatherAlerts: alerts,
        mostWantedRequests,
        stats,
      });
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, calculateStats]);

  const refreshData = useCallback(async () => {
    await loadDashboardData();
  }, [loadDashboardData]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  return {
    ...data,
    isLoading,
    error,
    refreshData,
  };
}
