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
    <View className="flex-1 p-6 bg-gray-50">
      <Text className="mb-8 text-2xl font-bold text-center text-gray-800">Toast Demo</Text>

      <View className="space-y-4">
        <Pressable
          onPress={handleShowSuccess}
          className="p-4 bg-green-500 rounded-lg active:bg-green-600">
          <Text className="font-semibold text-center text-white">Show Success Toast</Text>
        </Pressable>

        <Pressable
          onPress={handleShowError}
          className="p-4 bg-red-500 rounded-lg active:bg-red-600">
          <Text className="font-semibold text-center text-white">Show Error Toast</Text>
        </Pressable>

        <Pressable
          onPress={handleShowWarning}
          className="p-4 bg-yellow-500 rounded-lg active:bg-yellow-600">
          <Text className="font-semibold text-center text-white">Show Warning Toast</Text>
        </Pressable>

        <Pressable
          onPress={handleShowInfo}
          className="p-4 bg-blue-500 rounded-lg active:bg-blue-600">
          <Text className="font-semibold text-center text-white">Show Info Toast</Text>
        </Pressable>

        <Pressable
          onPress={handleShowLongMessage}
          className="p-4 bg-purple-500 rounded-lg active:bg-purple-600">
          <Text className="font-semibold text-center text-white">Show Long Message Toast</Text>
        </Pressable>

        <Pressable
          onPress={handleShowShortMessage}
          className="p-4 bg-gray-500 rounded-lg active:bg-gray-600">
          <Text className="font-semibold text-center text-white">Show Short Message Toast</Text>
        </Pressable>

        <Pressable
          onPress={() => showToast.hide()}
          className="p-4 bg-black rounded-lg active:bg-gray-800">
          <Text className="font-semibold text-center text-white">Hide All Toasts</Text>
        </Pressable>
      </View>

      <View className="p-4 mt-8 bg-white rounded-lg">
        <Text className="text-sm text-center text-gray-600">
          💡 Try long-pressing on any toast for a shake animation!
        </Text>
      </View>
    </View>
  );
}
