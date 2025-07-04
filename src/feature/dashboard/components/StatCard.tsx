import React from 'react';
import { View, Text } from 'react-native';

interface StatCardProps {
  title: string;
  value: number;
  color: string;
}

export function StatCard({ title, value, color }: StatCardProps) {
  return (
    <View className={`mx-1 flex-1 rounded-lg p-4 ${color}`}>
      <Text className="text-lg font-bold text-white">{value}</Text>
      <Text className="text-sm text-white opacity-90">{title}</Text>
    </View>
  );
}
