import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FeatureRequest } from '../../../types/featureRequest';
import { StatusBadge } from './StatusBadge';
import { VoteButton } from './VoteButton';

interface FeatureRequestCardProps {
  featureRequest: FeatureRequest;
  onVoteChange: () => void;
}

export function FeatureRequestCard({ featureRequest, onVoteChange }: FeatureRequestCardProps) {
  const isUpvoted = featureRequest.user_vote?.vote_type === 'upvote';
  const isDownvoted = featureRequest.user_vote?.vote_type === 'downvote';

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <View className="mb-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <View className="mb-2 flex-row items-start justify-between">
        <Text className="mr-2 flex-1 text-lg font-semibold text-gray-800">
          {featureRequest.title}
        </Text>
        <StatusBadge status={featureRequest.status} />
      </View>

      <Text className="mb-3 leading-5 text-gray-600">{featureRequest.description}</Text>

      <View className="mb-3 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Ionicons name="person" size={14} color="#6B7280" />
          <Text className="ml-1 text-sm text-gray-500">User</Text>
        </View>
        <Text className="text-sm text-gray-500">{formatDate(featureRequest.created_at)}</Text>
      </View>

      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Ionicons name="thumbs-up" size={16} color="#10B981" />
          <Text className="ml-1 text-sm font-medium text-gray-700">
            {featureRequest.votes_count} votes
          </Text>
        </View>

        <View className="flex-row space-x-2">
          <VoteButton
            featureRequestId={featureRequest.id}
            voteType="upvote"
            isVoted={isUpvoted}
            onVoteChange={onVoteChange}
          />
          <VoteButton
            featureRequestId={featureRequest.id}
            voteType="downvote"
            isVoted={isDownvoted}
            onVoteChange={onVoteChange}
          />
        </View>
      </View>
    </View>
  );
}
