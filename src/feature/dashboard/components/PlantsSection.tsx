import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { UserPlant } from '../../../types/userPlant';
import { PlantCard, AddPlantModal } from '../../plants';

interface PlantsSectionProps {
  userPlants: UserPlant[];
  onPlantAdded?: () => void;
  onPlantUpdated?: (updatedPlant: UserPlant) => void;
}

export function PlantsSection({ userPlants, onPlantAdded, onPlantUpdated }: PlantsSectionProps) {
  const router = useRouter();
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);

  const handleAddPlant = () => {
    setIsAddModalVisible(true);
  };

  const handlePlantAdded = () => {
    onPlantAdded?.();
  };

  const handleViewAll = () => {
    router.push('/plants');
  };

  return (
    <View className="px-4 py-4">
      <View className="mb-3 flex-row items-center justify-between">
        <Text className="text-lg font-semibold text-gray-800">My Plants</Text>
        <TouchableOpacity onPress={handleViewAll}>
          <Text className="text-sm text-blue-600">View All</Text>
        </TouchableOpacity>
      </View>
      {userPlants.length === 0 ? (
        <View className="items-center rounded-lg bg-white p-6">
          <Text className="mb-2 text-center text-gray-500">No plants added yet</Text>
          <TouchableOpacity className="rounded bg-green-500 px-4 py-2" onPress={handleAddPlant}>
            <Text className="font-medium text-white">Add Your First Plant</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {userPlants.slice(0, 3).map((plant) => (
            <PlantCard key={plant.id} plant={plant} onPlantUpdated={onPlantUpdated} />
          ))}
          <TouchableOpacity
            className="mt-3 items-center rounded-lg border-2 border-dashed border-gray-300 p-3"
            onPress={handleAddPlant}>
            <Text className="text-gray-500">+ Add Another Plant</Text>
          </TouchableOpacity>
        </>
      )}

      <AddPlantModal
        visible={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)}
        onPlantAdded={handlePlantAdded}
      />
    </View>
  );
}
