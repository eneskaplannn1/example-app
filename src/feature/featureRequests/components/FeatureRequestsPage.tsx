import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFeatureRequests } from '../hooks/useFeatureRequests';
import { FeatureRequestCard } from './FeatureRequestCard';
import { CreateFeatureRequestModal } from './CreateFeatureRequestModal';
import { FeatureRequestStatus } from '../../../types/featureRequest';

export function FeatureRequestsPage() {
  const [selectedStatus, setSelectedStatus] = useState<FeatureRequestStatus | undefined>(undefined);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const { featureRequests, isLoading, error, refreshData } = useFeatureRequests(selectedStatus);

  const statusOptions: { value: FeatureRequestStatus | undefined; label: string }[] = [
    { value: undefined, label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'under_review', label: 'Under Review' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'rejected', label: 'Rejected' },
  ];

  const handleVoteChange = () => {
    refreshData();
  };

  const handleRequestCreated = () => {
    refreshData();
  };

  if (error) {
    Alert.alert('Error', error);
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="border-b border-gray-200 bg-white px-4 py-4">
        <View className="flex-row items-center justify-between">
          <Text className="text-xl font-bold text-gray-800">Feature Requests</Text>
          <TouchableOpacity
            onPress={() => setIsCreateModalVisible(true)}
            className="flex-row items-center rounded-lg bg-blue-500 px-4 py-2">
            <Ionicons name="add" size={16} color="white" />
            <Text className="ml-1 font-medium text-white">New Request</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Status Filter */}
      <View className="border-b border-gray-200 bg-white px-4 py-3">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {statusOptions.map((option) => (
            <TouchableOpacity
              key={option.value || 'all'}
              onPress={() => setSelectedStatus(option.value)}
              className={`mr-2 rounded-full px-4 py-2 ${
                selectedStatus === option.value ? 'bg-blue-500' : 'bg-gray-100'
              }`}>
              <Text
                className={`text-sm font-medium ${
                  selectedStatus === option.value ? 'text-white' : 'text-gray-600'
                }`}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Content */}
      <ScrollView
        className="flex-1 px-4 py-4"
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refreshData} />}>
        {featureRequests.length === 0 ? (
          <View className="flex-1 items-center justify-center py-20">
            <Ionicons name="bulb-outline" size={64} color="#9CA3AF" />
            <Text className="mb-2 mt-4 text-lg font-medium text-gray-500">
              No feature requests found
            </Text>
            <Text className="text-center text-gray-400">
              {selectedStatus
                ? `No ${selectedStatus.replace('_', ' ')} requests yet.`
                : 'Be the first to suggest a new feature!'}
            </Text>
            {!selectedStatus && (
              <TouchableOpacity
                onPress={() => setIsCreateModalVisible(true)}
                className="mt-4 rounded-lg bg-blue-500 px-6 py-3">
                <Text className="font-medium text-white">Create First Request</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <>
            <Text className="mb-4 text-sm text-gray-600">
              {featureRequests.length} request{featureRequests.length !== 1 ? 's' : ''} found
            </Text>
            {featureRequests.map((featureRequest) => (
              <FeatureRequestCard
                key={featureRequest.id}
                featureRequest={featureRequest}
                onVoteChange={handleVoteChange}
              />
            ))}
          </>
        )}
      </ScrollView>

      <CreateFeatureRequestModal
        visible={isCreateModalVisible}
        onClose={() => setIsCreateModalVisible(false)}
        onRequestCreated={handleRequestCreated}
      />
    </SafeAreaView>
  );
}
