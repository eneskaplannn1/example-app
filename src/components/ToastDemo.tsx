import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { showToast } from './ToastManager';

export function ToastDemo() {
  const handleShowSuccess = () => {
    showToast.success('Success!', 'Your action was completed successfully.');
  };

  const handleShowError = () => {
    showToast.error('Error!', 'Something went wrong. Please try again.');
  };

  const handleShowWarning = () => {
    showToast.warning('Warning!', 'Please check your input before proceeding.');
  };

  const handleShowInfo = () => {
    showToast.info('Info', 'Here is some helpful information for you.');
  };

  const handleShowLongMessage = () => {
    showToast.success(
      'Plant Added Successfully!',
      'Your new plant "Monstera Deliciosa" has been added to your collection. You can now track its growth and set up care reminders.'
    );
  };

  const handleShowShortMessage = () => {
    showToast.info('Quick Update', 'Settings saved.');
  };

  return (
    <View className="flex-1 bg-gray-50 p-6">
      <Text className="mb-8 text-center text-2xl font-bold text-gray-800">Toast Demo</Text>

      <View className="space-y-4">
        <Pressable
          onPress={handleShowSuccess}
          className="rounded-lg bg-green-500 p-4 active:bg-green-600">
          <Text className="text-center font-semibold text-white">Show Success Toast</Text>
        </Pressable>

        <Pressable
          onPress={handleShowError}
          className="rounded-lg bg-red-500 p-4 active:bg-red-600">
          <Text className="text-center font-semibold text-white">Show Error Toast</Text>
        </Pressable>

        <Pressable
          onPress={handleShowWarning}
          className="rounded-lg bg-yellow-500 p-4 active:bg-yellow-600">
          <Text className="text-center font-semibold text-white">Show Warning Toast</Text>
        </Pressable>

        <Pressable
          onPress={handleShowInfo}
          className="rounded-lg bg-blue-500 p-4 active:bg-blue-600">
          <Text className="text-center font-semibold text-white">Show Info Toast</Text>
        </Pressable>

        <Pressable
          onPress={handleShowLongMessage}
          className="rounded-lg bg-purple-500 p-4 active:bg-purple-600">
          <Text className="text-center font-semibold text-white">Show Long Message Toast</Text>
        </Pressable>

        <Pressable
          onPress={handleShowShortMessage}
          className="rounded-lg bg-gray-500 p-4 active:bg-gray-600">
          <Text className="text-center font-semibold text-white">Show Short Message Toast</Text>
        </Pressable>

        <Pressable
          onPress={() => showToast.hide()}
          className="rounded-lg bg-black p-4 active:bg-gray-800">
          <Text className="text-center font-semibold text-white">Hide All Toasts</Text>
        </Pressable>
      </View>

      <View className="mt-8 rounded-lg bg-white p-4">
        <Text className="text-center text-sm text-gray-600">
          💡 Try long-pressing on any toast for a shake animation!
        </Text>
      </View>
    </View>
  );
}
