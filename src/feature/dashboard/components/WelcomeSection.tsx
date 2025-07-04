import React from 'react';
import { View, Text } from 'react-native';

interface WelcomeSectionProps {
  userName?: string;
  userEmail?: string;
}

export function WelcomeSection({ userName, userEmail }: WelcomeSectionProps) {
  return (
    <View className="border-b border-gray-200 bg-white px-4 py-4">
      <Text className="text-lg text-gray-600">Welcome back, {userName || userEmail}</Text>
    </View>
  );
}
