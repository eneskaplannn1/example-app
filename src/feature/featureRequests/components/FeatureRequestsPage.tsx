import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFeatureRequests } from '../hooks/useFeatureRequests';
import { FeatureRequestCard } from './FeatureRequestCard';
import { CreateFeatureRequestModal } from './CreateFeatureRequestModal';
import { FeatureRequestStatus } from '../../../types/featureRequest';

const statusOptions: { value: FeatureRequestStatus | undefined; label: string }[] = [
  { value: undefined, label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'under_review', label: 'Under Review' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'rejected', label: 'Rejected' },
];

export function FeatureRequestsPage() {
  const [selectedStatus, setSelectedStatus] = useState<FeatureRequestStatus | undefined>(undefined);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const { featureRequests, isLoading, refreshData } = useFeatureRequests(selectedStatus);

  const handleVoteChange = () => {
    refreshData();
  };

  const handleRequestCreated = () => {
    refreshData();
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-4 py-4 bg-white border-b border-gray-200">
        <View className="flex-row justify-between items-center">
          <Text className="text-xl font-bold text-gray-800">Feature Requests</Text>
          <TouchableOpacity
            onPress={() => setIsCreateModalVisible(true)}
            className="flex-row items-center px-4 py-2 bg-blue-500 rounded-lg">
            <Ionicons name="add" size={16} color="white" />
            <Text className="ml-1 font-medium text-white">New Request</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="px-4 py-3 bg-white border-b border-gray-200">
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

      <ScrollView
        className="flex-1 px-4 py-4"
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refreshData} />}>
        {featureRequests?.length === 0 ? (
          <View className="flex-1 justify-center items-center py-20">
            <Ionicons name="bulb-outline" size={64} color="#9CA3AF" />
            <Text className="mt-4 mb-2 text-lg font-medium text-gray-500">
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
                className="px-6 py-3 mt-4 bg-blue-500 rounded-lg">
                <Text className="font-medium text-white">Create First Request</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <>
            <Text className="mb-4 text-sm text-gray-600">
              {featureRequests?.length} request{featureRequests?.length !== 1 ? 's' : ''} found
            </Text>
            {featureRequests?.map((featureRequest) => (
              <FeatureRequestCard
                key={featureRequest.id}
                featureRequest={featureRequest}
                onVoteChange={handleVoteChange}
              />
            ))}
          </>
        )}
      </ScrollView>
      <View className="h-20" />

      <CreateFeatureRequestModal
        visible={isCreateModalVisible}
        onClose={() => setIsCreateModalVisible(false)}
        onRequestCreated={handleRequestCreated}
      />
    </SafeAreaView>
  );
}
