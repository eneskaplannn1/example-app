import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ProfileRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  onPress: () => void;
  destructive?: boolean;
  showBorder?: boolean;
}

export function ProfileRow({
  icon,
  title,
  subtitle,
  onPress,
  destructive = false,
  showBorder = true,
}: ProfileRowProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-row items-center p-5 ${showBorder ? 'border-b border-gray-100/60' : ''} active:bg-gray-50/50`}
      activeOpacity={0.7}>
      {/* Icon Container */}
      <View
        className={`mr-4 h-12 w-12 items-center justify-center rounded-xl ${
          destructive ? 'bg-red-100' : 'bg-blue-100'
        }`}>
        <Ionicons name={icon} size={24} color={destructive ? '#dc2626' : '#2563eb'} />
      </View>

      {/* Content */}
      <View className="flex-1">
        <Text
          className={`mb-1 text-base font-semibold ${destructive ? 'text-red-600' : 'text-gray-800'}`}>
          {title}
        </Text>
        <Text className="text-sm leading-5 text-gray-500">{subtitle}</Text>
      </View>

      {/* Chevron */}
      <View
        className={`h-8 w-8 items-center justify-center rounded-full ${
          destructive ? 'bg-red-50' : 'bg-gray-50'
        }`}>
        <Ionicons name="chevron-forward" size={20} color={destructive ? '#f87171' : '#9ca3af'} />
      </View>
    </TouchableOpacity>
  );
}
