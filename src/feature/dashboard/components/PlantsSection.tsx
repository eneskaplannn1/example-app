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
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-lg font-semibold text-gray-800">My Plants</Text>
        <TouchableOpacity onPress={handleViewAll}>
          <Text className="text-sm text-blue-600">View All</Text>
        </TouchableOpacity>
      </View>
      {userPlants.length === 0 ? (
        <View className="items-center p-6 bg-white rounded-lg">
          <Text className="mb-2 text-center text-gray-500">No plants added yet</Text>
          <TouchableOpacity className="px-4 py-2 bg-green-500 rounded" onPress={handleAddPlant}>
            <Text className="font-medium text-white">Add Your First Plant</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {userPlants.slice(0, 3).map((plant) => (
            <PlantCard key={plant.id} plant={plant} onPlantUpdated={onPlantUpdated} />
          ))}
          <TouchableOpacity
            className="items-center p-3 mt-3 rounded-lg border-2 border-gray-300 border-dashed"
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
