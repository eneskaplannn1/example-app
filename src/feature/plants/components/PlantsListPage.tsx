import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { UserPlant } from '../../../types/userPlant';
import { PlantCard } from './PlantCard';
import { AddPlantModal } from './AddPlantModal';
import { useUserPlants } from '../hooks';

export function PlantsListPage() {
  const router = useRouter();
  const { userPlants, isLoading, error, refreshData } = useUserPlants();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'needs-water' | 'healthy'>('all');
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshData();
    setRefreshing(false);
  }, [refreshData]);

  const handlePlantAdded = useCallback(async () => {
    await refreshData();
  }, [refreshData]);

  const handleAddPlant = () => {
    setIsAddModalVisible(true);
  };

  const handlePlantUpdated = useCallback(
    async (updatedPlant: UserPlant) => {
      await refreshData();
    },
    [refreshData]
  );

  const filteredPlants = userPlants?.filter((plant: UserPlant) => {
    const matchesSearch =
      plant.nickname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plant.plants?.common_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plant.plants?.scientific_name?.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterType === 'all') return true;

    const lastWatered = new Date(plant.last_watered);
    const daysSinceWatering = Math.floor(
      (Date.now() - lastWatered.getTime()) / (1000 * 60 * 60 * 24)
    );
    const needsWatering = daysSinceWatering >= 7;

    if (filterType === 'needs-water') return needsWatering;
    if (filterType === 'healthy') return !needsWatering;

    return true;
  });

  const getStats = () => {
    const total = userPlants?.length || 0;
    const needsWater = userPlants?.filter((plant: UserPlant) => {
      const lastWatered = new Date(plant.last_watered);
      const daysSinceWatering = Math.floor(
        (Date.now() - lastWatered.getTime()) / (1000 * 60 * 60 * 24)
      );
      return daysSinceWatering >= 7;
    }).length;
    const healthy = total - (needsWater || 0) || 0;

    return { total, needsWater, healthy };
  };

  const stats = getStats();

  if (error) {
    Alert.alert('Error', error);
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="px-4 py-4 bg-white border-b border-gray-200">
        <View className="flex-row justify-between items-center">
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-blue-600">← Back</Text>
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-gray-800">My Plants</Text>
          <TouchableOpacity onPress={handleAddPlant}>
            <Text className="text-blue-600">+ Add</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        {/* Stats Cards */}
        <View className="px-4 py-4">
          <View className="flex-row space-x-2">
            <View className="flex-1 p-3 bg-white rounded-lg">
              <Text className="text-lg font-bold text-gray-800">{stats.total}</Text>
              <Text className="text-sm text-gray-600">Total Plants</Text>
            </View>
            <View className="flex-1 p-3 bg-red-50 rounded-lg">
              <Text className="text-lg font-bold text-red-600">{stats.needsWater}</Text>
              <Text className="text-sm text-red-600">Need Water</Text>
            </View>
            <View className="flex-1 p-3 bg-green-50 rounded-lg">
              <Text className="text-lg font-bold text-green-600">{stats.healthy}</Text>
              <Text className="text-sm text-green-600">Healthy</Text>
            </View>
          </View>
        </View>

        {/* Search Bar */}
        <View className="px-4 pb-4">
          <TextInput
            className="px-3 py-2 bg-white rounded-lg border border-gray-300"
            placeholder="Search plants..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9ca3af"
          />
        </View>

        {/* Filter Tabs */}
        <View className="px-4 pb-4">
          <View className="flex-row p-1 bg-white rounded-lg">
            <TouchableOpacity
              className={`flex-1 rounded px-3 py-2 ${
                filterType === 'all' ? 'bg-blue-500' : 'bg-transparent'
              }`}
              onPress={() => setFilterType('all')}>
              <Text
                className={`text-center text-sm font-medium ${
                  filterType === 'all' ? 'text-white' : 'text-gray-600'
                }`}>
                All ({stats.total})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 rounded px-3 py-2 ${
                filterType === 'needs-water' ? 'bg-red-500' : 'bg-transparent'
              }`}
              onPress={() => setFilterType('needs-water')}>
              <Text
                className={`text-center text-sm font-medium ${
                  filterType === 'needs-water' ? 'text-white' : 'text-gray-600'
                }`}>
                Needs Water ({stats.needsWater})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 rounded px-3 py-2 ${
                filterType === 'healthy' ? 'bg-green-500' : 'bg-transparent'
              }`}
              onPress={() => setFilterType('healthy')}>
              <Text
                className={`text-center text-sm font-medium ${
                  filterType === 'healthy' ? 'text-white' : 'text-gray-600'
                }`}>
                Healthy ({stats.healthy})
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Plants List */}
        <View className="px-4 pb-4">
          {isLoading ? (
            <View className="items-center py-8">
              <ActivityIndicator size="large" color="#10b981" />
              <Text className="mt-2 text-gray-600">Loading plants...</Text>
            </View>
          ) : filteredPlants?.length === 0 ? (
            <View className="items-center py-8">
              {searchQuery || filterType !== 'all' ? (
                <>
                  <Text className="mb-2 text-lg font-medium text-gray-800">No plants found</Text>
                  <Text className="mb-4 text-center text-gray-600">
                    Try adjusting your search or filter criteria
                  </Text>
                  <TouchableOpacity
                    className="px-4 py-2 bg-blue-500 rounded-lg"
                    onPress={() => {
                      setSearchQuery('');
                      setFilterType('all');
                    }}>
                    <Text className="font-medium text-white">Clear Filters</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Text className="mb-2 text-lg font-medium text-gray-800">No plants yet</Text>
                  <Text className="mb-4 text-center text-gray-600">
                    Start your plant collection by adding your first plant
                  </Text>
                  <TouchableOpacity
                    className="px-4 py-2 bg-green-500 rounded-lg"
                    onPress={handleAddPlant}>
                    <Text className="font-medium text-white">Add Your First Plant</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          ) : (
            <>
              <Text className="mb-3 text-sm text-gray-600">
                {filteredPlants?.length} plant{filteredPlants?.length !== 1 ? 's' : ''} found
              </Text>
              {filteredPlants?.map((plant: UserPlant) => (
                <View key={plant.id} className="mb-3">
                  <PlantCard plant={plant} onPlantUpdated={handlePlantUpdated} />
                </View>
              ))}
            </>
          )}
        </View>
      </ScrollView>

      <AddPlantModal
        visible={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)}
        onPlantAdded={handlePlantAdded}
      />
    </SafeAreaView>
  );
}
