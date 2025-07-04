import React from 'react';
import { View, Text } from 'react-native';
import { StatCard } from './StatCard';

interface StatsSectionProps {
  stats: {
    totalPlants: number;
    needsWatering: number;
    activeReminders: number;
    weatherAlerts: number;
  };
}

export function StatsSection({ stats }: StatsSectionProps) {
  return (
    <View className="px-4 py-4">
      <Text className="mb-3 text-lg font-semibold text-gray-800">Overview</Text>
      <View className="flex-row">
        <StatCard title="Total Plants" value={stats.totalPlants} color="bg-green-500" />
        <StatCard title="Need Water" value={stats.needsWatering} color="bg-red-500" />
        <StatCard title="Reminders" value={stats.activeReminders} color="bg-blue-500" />
        <StatCard title="Weather Alerts" value={stats.weatherAlerts} color="bg-orange-500" />
      </View>
    </View>
  );
}
