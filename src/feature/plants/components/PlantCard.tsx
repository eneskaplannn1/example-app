import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { UserPlant } from '../../../types/userPlant';
import { updateUserPlant } from '../services/userPlantService';

interface PlantCardProps {
  plant: UserPlant;
  onPlantUpdated?: (updatedPlant: UserPlant) => void;
}

export function PlantCard({ plant, onPlantUpdated }: PlantCardProps) {
  const router = useRouter();
  const [isWatering, setIsWatering] = useState(false);

  const lastWatered = new Date(plant.last_watered);
  const daysSinceWatering = Math.floor(
    (Date.now() - lastWatered.getTime()) / (1000 * 60 * 60 * 24)
  );
  const needsWatering = daysSinceWatering >= 7;

  const handleWaterPlant = async () => {
    if (isWatering) return;

    setIsWatering(true);

    try {
      const updatedPlant = await updateUserPlant(plant.id, {
        last_watered: new Date().toISOString(),
      });

      if (updatedPlant) {
        onPlantUpdated?.(updatedPlant);
      } else {
        Alert.alert('Error', 'Failed to update plant watering time');
      }
    } catch (error) {
      console.error('Error watering plant:', error);
      Alert.alert('Error', 'Failed to water plant. Please try again.');
    } finally {
      setIsWatering(false);
    }
  };

  const handleCardPress = () => {
    router.push(`/plants/${plant.id}`);
  };

  return (
    <TouchableOpacity className="p-4 mb-3 bg-white rounded-lg shadow-sm" onPress={handleCardPress}>
      <View className="flex-row justify-between items-start">
        <View className="flex-row flex-1">
          {/* Plant Image */}
          <View className="mr-3">
            {plant.image_url ? (
              <Image
                source={{ uri: plant.image_url }}
                className="w-16 h-16 rounded-lg"
                resizeMode="cover"
              />
            ) : (
              <View className="justify-center items-center w-16 h-16 bg-gray-200 rounded-lg">
                <Text className="text-2xl">🌱</Text>
              </View>
            )}
          </View>

          {/* Plant Info */}
          <View className="flex-1">
            <Text className="text-lg font-semibold text-gray-800">
              {plant.nickname || plant.plants?.common_name || 'Unnamed Plant'}
            </Text>
            {plant.plants?.scientific_name && (
              <Text className="mb-1 text-xs italic text-gray-500">
                {plant.plants.scientific_name}
              </Text>
            )}
            <Text className="mb-2 text-sm text-gray-600">
              Last watered: {lastWatered.toLocaleDateString()}
            </Text>
            {plant.notes && (
              <Text className="text-sm text-gray-500" numberOfLines={2}>
                {plant.notes}
              </Text>
            )}
          </View>
        </View>

        <View className="items-end">
          {needsWatering && (
            <View className="px-2 py-1 mb-2 bg-red-100 rounded">
              <Text className="text-xs font-medium text-red-600">Needs Water</Text>
            </View>
          )}

          <View onStartShouldSetResponder={() => true}>
            <TouchableOpacity
              onPress={handleWaterPlant}
              disabled={isWatering}
              className={`mt-2 rounded-lg px-3 py-2 ${
                isWatering ? 'bg-gray-300' : needsWatering ? 'bg-blue-500' : 'bg-green-500'
              }`}>
              <Text className="text-xs font-medium text-white">
                {isWatering ? 'Watering...' : 'Water Plant'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
