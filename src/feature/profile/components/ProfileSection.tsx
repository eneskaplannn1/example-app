import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ProfileRow } from './ProfileRow';

interface ProfileSectionItem {
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
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
      <Text className="mb-4 text-xl font-bold text-gray-800">{title}</Text>
      <View className="overflow-hidden rounded-2xl border border-gray-100/50 bg-white shadow-lg shadow-gray-200/50">
        {items.map((item, index) => (
          <ProfileRow
            key={index}
            icon={item.icon}
            title={item.title}
            subtitle={item.subtitle}
            onPress={item.onPress}
            destructive={item.destructive}
            showBorder={index !== items.length - 1}
          />
        ))}
      </View>
    </View>
  );
}
