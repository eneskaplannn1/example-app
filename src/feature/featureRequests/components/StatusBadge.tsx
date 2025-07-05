import React from 'react';
import { View, Text } from 'react-native';
import { FeatureRequestStatus } from '../../../types/featureRequest';

interface StatusBadgeProps {
  status: FeatureRequestStatus;
}

const statusConfig = {
  pending: {
    label: 'Pending',
    color: 'bg-yellow-50',
    textColor: 'text-yellow-700',
    borderColor: 'border-yellow-200',
  },
  under_review: {
    label: 'Under Review',
    color: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200',
  },
  in_progress: {
    label: 'In Progress',
    color: 'bg-purple-50',
    textColor: 'text-purple-700',
    borderColor: 'border-purple-200',
  },
  completed: {
    label: 'Completed',
    color: 'bg-green-50',
    textColor: 'text-green-700',
    borderColor: 'border-green-200',
  },
  rejected: {
    label: 'Rejected',
    color: 'bg-red-50',
    textColor: 'text-red-700',
    borderColor: 'border-red-200',
  },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <View className={`rounded-full border px-3 py-1.5 ${config.color} ${config.borderColor}`}>
      <Text className={`text-xs font-bold ${config.textColor}`}>{config.label}</Text>
    </View>
  );
}
