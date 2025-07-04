import { useState } from 'react';
import { ScrollView, RefreshControl, Alert, View } from 'react-native';
import { useAuth } from '../../../context/AuthContext';
import { useDashboard } from '../hooks/useDashboard';
import { UserPlant } from '../../../types/userPlant';
import { WelcomeSection } from './WelcomeSection';
import { StatsSection } from './StatsSection';
import { PlantsSection } from './PlantsSection';
import { RemindersSection } from './RemindersSection';
import { WeatherAlertsSection } from './WeatherAlertsSection';
import { MostWantedRequestsSection } from './MostWantedRequestsSection';
import { LoadingScreen } from './LoadingScreen';

export function Dashboard() {
  const { user } = useAuth();
  const {
    userPlants,
    careReminders,
    weatherAlerts,
    mostWantedRequests,
    stats,
    isLoading,
    error,
    refreshData,
  } = useDashboard();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    setRefreshing(false);
  };

  const handlePlantAdded = async () => {
    await refreshData();
  };

  const handlePlantUpdated = async (updatedPlant: UserPlant) => {
    await refreshData();
  };

  if (error) {
    Alert.alert('Error', error);
  }

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <ScrollView
        className="flex-1"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <WelcomeSection userName={user?.name} userEmail={user?.email} />

        <StatsSection stats={stats} />
        <PlantsSection
          userPlants={userPlants}
          onPlantAdded={handlePlantAdded}
          onPlantUpdated={handlePlantUpdated}
        />
        <MostWantedRequestsSection mostWantedRequests={mostWantedRequests} />
        <RemindersSection careReminders={careReminders} />
        <WeatherAlertsSection weatherAlerts={weatherAlerts} />
        <View className="h-20" />
      </ScrollView>
    </>
  );
}
