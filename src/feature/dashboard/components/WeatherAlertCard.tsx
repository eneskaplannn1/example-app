import React from 'react';
import { View, Text } from 'react-native';
import { WeatherAlert } from '../../../types/weatherAlert';

interface WeatherAlertCardProps {
  alert: WeatherAlert;
}

export function WeatherAlertCard({ alert }: WeatherAlertCardProps) {
  return (
    <View className="mb-2 rounded-lg border-l-4 border-orange-400 bg-orange-50 p-3">
      <Text className="text-sm font-medium capitalize text-gray-800">{alert.alert_type} Alert</Text>
      <Text className="text-xs text-gray-600">
        {new Date(alert.alert_time).toLocaleDateString()}
      </Text>
      <Text className="mt-1 text-xs text-gray-700">{alert.message}</Text>
    </View>
  );
}
