import { useState } from 'react';
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
import { User } from '../../../types/user';

interface UpdateProfileModalProps {
  visible: boolean;
  onClose: () => void;
  onUpdate: (profileData: { name: string; surname: string; profilePhoto?: string }) => void;
  user: User | null;
  isLoading: boolean;
}

export function UpdateProfileModal({
  visible,
  onClose,
  onUpdate,
  user,
  isLoading,
}: UpdateProfileModalProps) {
  const [name, setName] = useState(user?.name || '');
  const [surname, setSurname] = useState(user?.surname || '');
  const [profilePhoto, setProfilePhoto] = useState<string | null>(user?.profile_photo || null);

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
      setProfilePhoto(result.assets[0].uri);
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
      setProfilePhoto(result.assets[0].uri);
    }
  };

  const showImagePickerOptions = () => {
    Alert.alert('Update Profile Photo', 'Choose how you want to update your profile photo', [
      { text: 'Take Photo', onPress: takePhoto },
      { text: 'Choose from Library', onPress: pickImage },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    onUpdate({
      name: name.trim(),
      surname: surname.trim(),
      profilePhoto: profilePhoto || undefined,
    });
  };

  const resetForm = () => {
    setName(user?.name || '');
    setSurname(user?.surname || '');
    setProfilePhoto(user?.profile_photo || null);
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View className="flex-1 bg-gray-50">
        {/* Header */}
        <View className="px-4 py-4 bg-white border-b border-gray-200">
          <View className="flex-row justify-between items-center">
            <Text className="text-lg font-semibold text-gray-800">Edit Profile</Text>
            <TouchableOpacity onPress={onClose}>
              <Text className="text-blue-600">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView className="flex-1 px-4 py-4">
          {/* Profile Photo */}
          <View className="items-center mb-6">
            <Text className="mb-3 text-lg font-semibold text-gray-800">Profile Photo</Text>
            <TouchableOpacity onPress={showImagePickerOptions} className="mb-4">
              {profilePhoto ? (
                <Image
                  source={{ uri: profilePhoto }}
                  className="w-24 h-24 rounded-full"
                  resizeMode="cover"
                />
              ) : (
                <View className="justify-center items-center w-24 h-24 bg-gray-200 rounded-full">
                  <Text className="text-4xl">👤</Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={showImagePickerOptions}>
              <Text className="text-blue-600">Change Photo</Text>
            </TouchableOpacity>
          </View>

          {/* Profile Information */}
          <View className="mb-6">
            <Text className="mb-3 text-lg font-semibold text-gray-800">Personal Information</Text>

            <View className="mb-4">
              <Text className="mb-2 text-sm font-medium text-gray-700">First Name</Text>
              <TextInput
                className="px-3 py-2 bg-white rounded-lg border border-gray-300"
                value={name}
                onChangeText={setName}
                placeholder="Enter your first name"
                placeholderTextColor="#9ca3af"
              />
            </View>

            <View className="mb-4">
              <Text className="mb-2 text-sm font-medium text-gray-700">Last Name</Text>
              <TextInput
                className="px-3 py-2 bg-white rounded-lg border border-gray-300"
                value={surname}
                onChangeText={setSurname}
                placeholder="Enter your last name"
                placeholderTextColor="#9ca3af"
              />
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            className={`mb-6 rounded-lg p-4 ${
              isLoading || !name.trim() ? 'bg-gray-300' : 'bg-blue-500'
            }`}
            onPress={handleSubmit}
            disabled={isLoading || !name.trim()}>
            {isLoading ? (
              <View className="items-center">
                <ActivityIndicator size="small" color="white" />
                <Text className="mt-1 font-medium text-white">Updating...</Text>
              </View>
            ) : (
              <Text className="font-medium text-center text-white">Update Profile</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
}
