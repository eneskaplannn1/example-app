import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';

interface ChangePasswordModalProps {
  visible: boolean;
  onClose: () => void;
  onChangePassword: (passwordData: { currentPassword: string; newPassword: string }) => void;
  isLoading: boolean;
}

export function ChangePasswordModal({
  visible,
  onClose,
  onChangePassword,
  isLoading,
}: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = () => {
    if (!currentPassword.trim()) {
      Alert.alert('Error', 'Please enter your current password');
      return;
    }

    if (!newPassword.trim()) {
      Alert.alert('Error', 'Please enter a new password');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Error', 'New password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    onChangePassword({
      currentPassword: currentPassword.trim(),
      newPassword: newPassword.trim(),
    });
  };

  const resetForm = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View className="flex-1 bg-gray-50">
        {/* Header */}
        <View className="border-b border-gray-200 bg-white px-4 py-4">
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-semibold text-gray-800">Change Password</Text>
            <TouchableOpacity onPress={onClose}>
              <Text className="text-blue-600">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView className="flex-1 px-4 py-4">
          <View className="mb-6">
            <Text className="mb-3 text-lg font-semibold text-gray-800">Password Information</Text>

            <View className="mb-4">
              <Text className="mb-2 text-sm font-medium text-gray-700">Current Password</Text>
              <View className="flex-row items-center rounded-lg border border-gray-300 bg-white px-3">
                <TextInput
                  className="flex-1 py-2"
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  placeholder="Enter your current password"
                  placeholderTextColor="#9ca3af"
                  secureTextEntry={!showCurrentPassword}
                />
                <TouchableOpacity onPress={() => setShowCurrentPassword(!showCurrentPassword)}>
                  <Text className="text-blue-600">{showCurrentPassword ? 'Hide' : 'Show'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View className="mb-4">
              <Text className="mb-2 text-sm font-medium text-gray-700">New Password</Text>
              <View className="flex-row items-center rounded-lg border border-gray-300 bg-white px-3">
                <TextInput
                  className="flex-1 py-2"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="Enter your new password"
                  placeholderTextColor="#9ca3af"
                  secureTextEntry={!showNewPassword}
                />
                <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
                  <Text className="text-blue-600">{showNewPassword ? 'Hide' : 'Show'}</Text>
                </TouchableOpacity>
              </View>
              <Text className="mt-1 text-xs text-gray-500">
                Password must be at least 6 characters long
              </Text>
            </View>

            <View className="mb-4">
              <Text className="mb-2 text-sm font-medium text-gray-700">Confirm New Password</Text>
              <View className="flex-row items-center rounded-lg border border-gray-300 bg-white px-3">
                <TextInput
                  className="flex-1 py-2"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm your new password"
                  placeholderTextColor="#9ca3af"
                  secureTextEntry={!showConfirmPassword}
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <Text className="text-blue-600">{showConfirmPassword ? 'Hide' : 'Show'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            className={`mb-6 rounded-lg p-4 ${
              isLoading ||
              !currentPassword.trim() ||
              !newPassword.trim() ||
              !confirmPassword.trim() ||
              newPassword !== confirmPassword
                ? 'bg-gray-300'
                : 'bg-blue-500'
            }`}
            onPress={handleSubmit}
            disabled={
              isLoading ||
              !currentPassword.trim() ||
              !newPassword.trim() ||
              !confirmPassword.trim() ||
              newPassword !== confirmPassword
            }>
            {isLoading ? (
              <View className="items-center">
                <ActivityIndicator size="small" color="white" />
                <Text className="mt-1 font-medium text-white">Changing Password...</Text>
              </View>
            ) : (
              <Text className="text-center font-medium text-white">Change Password</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
}
