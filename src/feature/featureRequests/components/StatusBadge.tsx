import React from 'react';
import { View, Text } from 'react-native';
import { FeatureRequestStatus } from '../../../types/featureRequest';

interface StatusBadgeProps {
  status: FeatureRequestStatus;
}

const statusConfig = {
  pending: {
    label: 'Pending',
    color: 'bg-yellow-100',
    textColor: 'text-yellow-800',
  },
  under_review: {
    label: 'Under Review',
    color: 'bg-blue-100',
    textColor: 'text-blue-800',
  },
  in_progress: {
    label: 'In Progress',
    color: 'bg-purple-100',
    textColor: 'text-purple-800',
  },
  completed: {
    label: 'Completed',
    color: 'bg-green-100',
    textColor: 'text-green-800',
  },
  rejected: {
    label: 'Rejected',
    color: 'bg-red-100',
    textColor: 'text-red-800',
  },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <View className={`rounded-full px-2 py-1 ${config.color}`}>
      <Text className={`text-xs font-medium ${config.textColor}`}>{config.label}</Text>
    </View>
  );
}
