import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getUserPlantById, waterPlant } from '../../feature/plants/services/userPlantService';
import { getCareRemindersByPlant } from '../../services/careReminderService';
import { UserPlant } from '../../types/userPlant';
import { CareReminder } from '../../types/careReminder';
import { CreateReminderModal } from '../../feature/plants/components/CreateReminderModal';
import { PlantRemindersSection } from '../../feature/plants/components/PlantRemindersSection';

export default function PlantDetailPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [plant, setPlant] = useState<UserPlant | null>(null);
  const [reminders, setReminders] = useState<CareReminder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isWatering, setIsWatering] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);

  useEffect(() => {
    if (id) {
      loadPlant();
    }
  }, [id]);

  const loadPlant = async () => {
    try {
      setIsLoading(true);
      const [plantData, remindersData] = await Promise.all([
        getUserPlantById(id),
        getCareRemindersByPlant(id),
      ]);
      setPlant(plantData);
      setReminders(remindersData);
    } catch (error) {
      console.error('Error loading plant:', error);
      Alert.alert('Error', 'Failed to load plant details');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#10b981" />
          <Text className="mt-2 text-gray-600">Loading plant details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!plant) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 items-center justify-center px-4">
          <Text className="text-lg font-medium text-gray-800">Plant Not Found</Text>
          <Text className="mt-2 text-center text-gray-600">
            The plant you&apos;re looking for doesn&apos;t exist or has been removed.
          </Text>
          <TouchableOpacity
            className="mt-4 rounded-lg bg-blue-500 px-4 py-2"
            onPress={() => router.back()}>
            <Text className="font-medium text-white">Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const lastWatered = new Date(plant.last_watered);
  const daysSinceWatering = Math.floor(
    (Date.now() - lastWatered.getTime()) / (1000 * 60 * 60 * 24)
  );
  const needsWatering = daysSinceWatering >= 7;

  const handleWaterPlant = async () => {
    if (!plant) return;

    try {
      setIsWatering(true);
      const updatedPlant = await waterPlant(plant.id);
      if (updatedPlant) {
        setPlant(updatedPlant);
        Alert.alert('Success', 'Plant watered successfully!');
      }
    } catch (error) {
      console.error('Error watering plant:', error);
      Alert.alert('Error', 'Failed to water plant');
    } finally {
      setIsWatering(false);
    }
  };

  const handleReminderCreated = () => {
    loadPlant(); // Reload to get updated reminders
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="border-b border-gray-200 bg-white px-4 py-4">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-blue-600">← Back</Text>
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-gray-800">Plant Details</Text>
          <View className="w-12" />
        </View>
      </View>

      <ScrollView className="flex-1 px-4 py-4">
        {/* Plant Image */}
        <View className="mb-6 items-center">
          {plant.image_url ? (
            <Image
              source={{ uri: plant.image_url }}
              className="h-48 w-48 rounded-lg"
              resizeMode="cover"
            />
          ) : (
            <View className="h-48 w-48 items-center justify-center rounded-lg bg-gray-200">
              <Text className="text-6xl">🌱</Text>
            </View>
          )}
        </View>

        {/* Plant Name */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-800">
            {plant.nickname || plant.plants?.common_name || 'Unnamed Plant'}
          </Text>
          {plant.plants?.scientific_name && (
            <Text className="mt-1 text-lg italic text-gray-500">
              {plant.plants.scientific_name}
            </Text>
          )}
        </View>

        {/* Care Status */}
        <View className="mb-6 rounded-lg bg-white p-4 shadow-sm">
          <Text className="mb-3 text-lg font-semibold text-gray-800">Care Status</Text>
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-sm text-gray-600">Last Watered</Text>
              <Text className="text-lg font-medium text-gray-800">
                {lastWatered.toLocaleDateString()}
              </Text>
              <Text className="text-sm text-gray-500">{daysSinceWatering} days ago</Text>
            </View>
            {needsWatering && (
              <View className="rounded bg-red-100 px-3 py-2">
                <Text className="font-medium text-red-600">Needs Water</Text>
              </View>
            )}
          </View>
        </View>

        {/* Plant Information */}
        <View className="mb-6 rounded-lg bg-white p-4 shadow-sm">
          <Text className="mb-3 text-lg font-semibold text-gray-800">Plant Information</Text>

          <View className="mb-3">
            <Text className="text-sm text-gray-600">Acquired Date</Text>
            <Text className="text-base font-medium text-gray-800">
              {new Date(plant.acquired_date).toLocaleDateString()}
            </Text>
          </View>

          {plant.plants?.description && (
            <View className="mb-3">
              <Text className="text-sm text-gray-600">Description</Text>
              <Text className="text-base text-gray-800">{plant.plants.description}</Text>
            </View>
          )}

          {plant.notes && (
            <View className="mb-3">
              <Text className="text-sm text-gray-600">Notes</Text>
              <Text className="text-base text-gray-800">{plant.notes}</Text>
            </View>
          )}
        </View>

        {/* Actions */}
        <View className="mb-6 rounded-lg bg-white p-4 shadow-sm">
          <Text className="mb-3 text-lg font-semibold text-gray-800">Actions</Text>
          <TouchableOpacity
            className={`rounded-lg p-3 ${isWatering ? 'bg-gray-300' : needsWatering ? 'bg-blue-500' : 'bg-green-500'}`}
            onPress={handleWaterPlant}
            disabled={isWatering}>
            <Text className="text-center font-medium text-white">
              {isWatering ? 'Watering...' : 'Water Plant'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Reminders Section */}
        <PlantRemindersSection
          reminders={reminders}
          onAddReminder={() => setShowReminderModal(true)}
        />
      </ScrollView>

      {/* Create Reminder Modal */}
      <CreateReminderModal
        visible={showReminderModal}
        onClose={() => setShowReminderModal(false)}
        userPlantId={plant.id}
        plantName={plant.nickname || plant.plants?.common_name || 'Plant'}
        onReminderCreated={handleReminderCreated}
      />
    </SafeAreaView>
  );
}
