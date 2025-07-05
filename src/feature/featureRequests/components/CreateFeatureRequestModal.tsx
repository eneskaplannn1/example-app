import { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCreateFeatureRequest } from '../hooks/useCreateFeatureRequest';
import { CreateFeatureRequestData } from '../../../types/featureRequest';

interface CreateFeatureRequestModalProps {
  visible: boolean;
  onClose: () => void;
  onRequestCreated: () => void;
}

export function CreateFeatureRequestModal({
  visible,
  onClose,
  onRequestCreated,
}: CreateFeatureRequestModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const { createFeatureRequest, isLoading, error } = useCreateFeatureRequest();

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title for your feature request');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Error', 'Please enter a description for your feature request');
      return;
    }

    const requestData: CreateFeatureRequestData = {
      title: title.trim(),
      description: description.trim(),
    };

    const result = await createFeatureRequest(requestData);
    if (result) {
      setTitle('');
      setDescription('');
      onRequestCreated();
      onClose();
      Alert.alert('Success', 'Feature request created successfully!');
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setTitle('');
      setDescription('');
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 bg-white">
        <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
          <Text className="text-lg font-semibold text-gray-800">New Feature Request</Text>
          <TouchableOpacity onPress={handleClose} disabled={isLoading}>
            <Ionicons name="close" size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 p-4">
          <View className="mb-4">
            <Text className="mb-2 text-sm font-medium text-gray-700">Title *</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Enter a clear, descriptive title"
              className="p-3 text-gray-800 rounded-lg border border-gray-300"
              maxLength={100}
            />
            <Text className="mt-1 text-xs text-gray-500">{title.length}/100 characters</Text>
          </View>

          <View className="mb-6">
            <Text className="mb-2 text-sm font-medium text-gray-700">Description *</Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Describe the feature you'd like to see implemented..."
              className="p-3 text-gray-800 rounded-lg border border-gray-300"
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              maxLength={1000}
            />
            <Text className="mt-1 text-xs text-gray-500">{description.length}/1000 characters</Text>
          </View>

          {error && (
            <View className="p-3 mb-4 bg-red-100 rounded-lg">
              <Text className="text-sm text-red-700">{error}</Text>
            </View>
          )}

          <View className="p-4 mb-4 bg-gray-50 rounded-lg">
            <Text className="text-sm text-gray-600">
              <Text className="font-medium">Tips for a great feature request:</Text>
              {'\n'}• Be specific about what you want to achieve
              {'\n'}• Explain why this feature would be useful
              {'\n'}• Consider how it would benefit other users
              {'\n'}• Keep it concise but informative
            </Text>
          </View>
        </ScrollView>

        <View className="p-4 border-t border-gray-200">
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={isLoading || !title.trim() || !description.trim()}
            className={`rounded-lg p-3 ${
              isLoading || !title.trim() || !description.trim() ? 'bg-gray-300' : 'bg-blue-500'
            }`}>
            <Text
              className={`text-center font-medium ${
                isLoading || !title.trim() || !description.trim() ? 'text-gray-500' : 'text-white'
              }`}>
              {isLoading ? 'Creating...' : 'Submit Feature Request'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
