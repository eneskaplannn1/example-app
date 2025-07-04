import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAddPlant } from '../hooks/useAddPlant';
import { Plant } from '../../../types/plant';

interface AddPlantModalProps {
  visible: boolean;
  onClose: () => void;
  onPlantAdded: () => void;
}

export function AddPlantModal({ visible, onClose, onPlantAdded }: AddPlantModalProps) {
  const { addPlant, loadAvailablePlants, availablePlants, isLoading, isLoadingPlants, error } =
    useAddPlant();
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [nickname, setNickname] = useState('');
  const [acquiredDate, setAcquiredDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      loadAvailablePlants();
    }
  }, [visible, loadAvailablePlants]);

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
    }
  }, [error]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions to select an image.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera permissions to take a photo.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  const showImagePickerOptions = () => {
    Alert.alert('Add Plant Image', 'Choose how you want to add an image', [
      { text: 'Take Photo', onPress: takePhoto },
      { text: 'Choose from Library', onPress: pickImage },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleSubmit = async () => {
    if (!selectedPlant) {
      Alert.alert('Error', 'Please select a plant');
      return;
    }

    if (!nickname.trim()) {
      Alert.alert('Error', 'Please enter a nickname for your plant');
      return;
    }

    const result = await addPlant({
      plant_id: selectedPlant.id,
      nickname: nickname.trim(),
      acquired_date: acquiredDate,
      notes: notes.trim(),
      image_url: imageUri || undefined,
    });

    if (result) {
      Alert.alert('Success', 'Plant added successfully!');
      resetForm();
      onPlantAdded();
      onClose();
    }
  };

  const resetForm = () => {
    setSelectedPlant(null);
    setNickname('');
    setAcquiredDate(new Date().toISOString().split('T')[0]);
    setNotes('');
    setImageUri(null);
  };

  const PlantOption = ({ plant }: { plant: Plant }) => (
    <TouchableOpacity
      className={`mb-2 rounded-lg border p-3 ${
        selectedPlant?.id === plant.id ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white'
      }`}
      onPress={() => setSelectedPlant(plant)}>
      <Text className="font-medium text-gray-800">{plant.common_name}</Text>
      <Text className="text-sm italic text-gray-500">{plant.scientific_name}</Text>
      <Text className="mt-1 text-xs text-gray-400">{plant.description}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View className="flex-1 bg-gray-50">
        {/* Header */}
        <View className="px-4 py-4 bg-white border-b border-gray-200">
          <View className="flex-row justify-between items-center">
            <Text className="text-lg font-semibold text-gray-800">Add New Plant</Text>
            <TouchableOpacity onPress={onClose}>
              <Text className="text-blue-600">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView className="flex-1 px-4 py-4">
          {/* Plant Selection */}
          <View className="mb-6">
            <Text className="mb-3 text-lg font-semibold text-gray-800">Select Plant</Text>
            {isLoadingPlants ? (
              <View className="items-center py-8">
                <ActivityIndicator size="large" color="#10b981" />
                <Text className="mt-2 text-gray-600">Loading plants...</Text>
              </View>
            ) : (
              <View>
                {availablePlants.map((plant) => (
                  <PlantOption key={plant.id} plant={plant} />
                ))}
              </View>
            )}
          </View>

          {/* Plant Image */}
          <View className="mb-6">
            <Text className="mb-3 text-lg font-semibold text-gray-800">Plant Image</Text>
            <TouchableOpacity
              onPress={showImagePickerOptions}
              className="justify-center items-center p-6 bg-white rounded-lg border-2 border-gray-300 border-dashed">
              {imageUri ? (
                <View className="items-center">
                  <Image source={{ uri: imageUri }} className="mb-2 w-24 h-24 rounded-lg" />
                  <Text className="text-sm text-blue-600">Tap to change image</Text>
                </View>
              ) : (
                <View className="items-center">
                  <Text className="mb-2 text-4xl">📷</Text>
                  <Text className="text-center text-gray-600">
                    Tap to add a photo of your plant
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Plant Details */}
          <View className="mb-6">
            <Text className="mb-3 text-lg font-semibold text-gray-800">Plant Details</Text>

            <View className="mb-4">
              <Text className="mb-2 text-sm font-medium text-gray-700">Nickname</Text>
              <TextInput
                className="px-3 py-2 bg-white rounded-lg border border-gray-300"
                value={nickname}
                onChangeText={setNickname}
                placeholder="Give your plant a nickname"
                placeholderTextColor="#9ca3af"
              />
            </View>

            <View className="mb-4">
              <Text className="mb-2 text-sm font-medium text-gray-700">Acquired Date</Text>
              <TextInput
                className="px-3 py-2 bg-white rounded-lg border border-gray-300"
                value={acquiredDate}
                onChangeText={setAcquiredDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#9ca3af"
              />
            </View>

            <View className="mb-4">
              <Text className="mb-2 text-sm font-medium text-gray-700">Notes (Optional)</Text>
              <TextInput
                className="px-3 py-2 bg-white rounded-lg border border-gray-300"
                value={notes}
                onChangeText={setNotes}
                placeholder="Add any notes about your plant"
                placeholderTextColor="#9ca3af"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            className={`mb-6 rounded-lg p-4 ${
              isLoading || !selectedPlant || !nickname.trim() ? 'bg-gray-300' : 'bg-green-500'
            }`}
            onPress={handleSubmit}
            disabled={isLoading || !selectedPlant || !nickname.trim()}>
            {isLoading ? (
              <View className="items-center">
                <ActivityIndicator size="small" color="white" />
                <Text className="mt-1 font-medium text-white">Adding Plant...</Text>
              </View>
            ) : (
              <Text className="font-medium text-center text-white">Add Plant</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
}
