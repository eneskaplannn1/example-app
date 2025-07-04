import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface LoadingScreenProps {
  message?: string;
}

export default function LoadingScreen({ message = 'Loading...' }: LoadingScreenProps) {
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#22c55e" />
        <Text className="mt-4 text-lg text-gray-600">{message}</Text>
      </View>
    </SafeAreaView>
  );
}
