import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface ProfileSectionItem {
  title: string;
  subtitle: string;
  icon: string;
  onPress: () => void;
  destructive?: boolean;
}

interface ProfileSectionProps {
  title: string;
  items: ProfileSectionItem[];
}

export function ProfileSection({ title, items }: ProfileSectionProps) {
  return (
    <View className="mb-6">
      <Text className="mb-3 text-lg font-semibold text-gray-800">{title}</Text>
      <View className="rounded-lg bg-white shadow-sm">
        {items.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={item.onPress}
            className={`flex-row items-center p-4 ${
              index !== items.length - 1 ? 'border-b border-gray-100' : ''
            }`}>
            <Text className="mr-3 text-2xl">{item.icon}</Text>
            <View className="flex-1">
              <Text
                className={`font-medium ${item.destructive ? 'text-red-600' : 'text-gray-800'}`}>
                {item.title}
              </Text>
              <Text className="text-sm text-gray-500">{item.subtitle}</Text>
            </View>
            <Text className="text-gray-400">›</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
