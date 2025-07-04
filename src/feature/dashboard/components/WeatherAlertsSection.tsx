import React from 'react';
import { View, Text } from 'react-native';
import { WeatherAlert } from '../../../types/weatherAlert';
import { WeatherAlertCard } from './WeatherAlertCard';

interface WeatherAlertsSectionProps {
  weatherAlerts: WeatherAlert[];
}

export function WeatherAlertsSection({ weatherAlerts }: WeatherAlertsSectionProps) {
  if (weatherAlerts.length === 0) return null;

  return (
    <View className="px-4 py-4">
      <Text className="mb-3 text-lg font-semibold text-gray-800">Weather Alerts</Text>
      {weatherAlerts.slice(0, 3).map((alert) => (
        <WeatherAlertCard key={alert.id} alert={alert} />
      ))}
    </View>
  );
}
