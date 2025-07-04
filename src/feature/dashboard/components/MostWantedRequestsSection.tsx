import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { featureRequestService } from '../../../services/featureRequestService';
import { FeatureRequest } from '../../../types/featureRequest';
import { StatusBadge } from '../../featureRequests/components/StatusBadge';

interface MostWantedRequestsSectionProps {
  mostWantedRequests: FeatureRequest[];
}

export function MostWantedRequestsSection({ mostWantedRequests }: MostWantedRequestsSectionProps) {
  const router = useRouter();

  const handleViewAll = () => {
    router.push('/tabs/feature-requests');
  };

  if (mostWantedRequests.length === 0) {
    return null;
  }

  return (
    <View className="px-4 py-4">
      <View className="mb-3 flex-row items-center justify-between">
        <Text className="text-lg font-semibold text-gray-800">Most Wanted Features</Text>
        <TouchableOpacity onPress={handleViewAll}>
          <Text className="font-medium text-blue-500">View All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {mostWantedRequests.slice(0, 3).map((request) => (
          <View
            key={request.id}
            className="mr-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
            style={{ minWidth: 280 }}>
            <View className="mb-2 flex-row items-start justify-between">
              <Text className="mr-2 flex-1 text-sm font-semibold text-gray-800" numberOfLines={2}>
                {request.title}
              </Text>
              <StatusBadge status={request.status} />
            </View>

            <Text className="mb-3 text-xs text-gray-600" numberOfLines={2}>
              {request.description}
            </Text>

            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Ionicons name="thumbs-up" size={14} color="#10B981" />
                <Text className="ml-1 text-xs font-medium text-gray-700">
                  {request.votes_count} votes
                </Text>
              </View>
              <Text className="text-xs text-gray-500">
                {new Date(request.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
