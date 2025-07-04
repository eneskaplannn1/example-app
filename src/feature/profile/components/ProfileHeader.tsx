import React from 'react';
import { View, Text, Image } from 'react-native';
import { User } from '../../../types/user';

interface ProfileHeaderProps {
  user: User | null;
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  const fullName = user ? `${user.name || ''} ${user.surname || ''}`.trim() : 'User';
  const email = user?.email || 'No email';

  return (
    <View className="items-center p-6 mb-6 bg-white rounded-lg shadow-sm">
      <View className="mb-4">
        {user?.profile_photo ? (
          <Image
            source={{ uri: user.profile_photo }}
            className="w-24 h-24 rounded-full"
            resizeMode="cover"
          />
        ) : (
          <View className="justify-center items-center w-24 h-24 bg-gray-200 rounded-full">
            <Text className="text-4xl">👤</Text>
          </View>
        )}
      </View>

      <View className="items-center">
        <Text className="text-xl font-bold text-gray-800">{fullName}</Text>
        <Text className="mt-1 text-gray-600">{email}</Text>
        <Text className="mt-2 text-sm text-gray-500">Plant Care Enthusiast</Text>
      </View>
    </View>
  );
}
