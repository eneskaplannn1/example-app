import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FeatureRequest } from '../../../types/featureRequest';
import { StatusBadge } from './StatusBadge';
import { VoteButton } from './VoteButton';
import { formatDate } from '~/src/utils/formatters';

interface FeatureRequestCardProps {
  featureRequest: FeatureRequest;
  onVoteChange: () => void;
}

export function FeatureRequestCard({ featureRequest, onVoteChange }: FeatureRequestCardProps) {
  const isUpvoted = featureRequest.user_vote?.vote_type === 'upvote';
  const isDownvoted = featureRequest.user_vote?.vote_type === 'downvote';

  return (
    <View className="mb-4 rounded-xl border border-gray-100 bg-white p-5 shadow-lg shadow-gray-200/50">
      {/* Header with title and status */}
      <View className="mb-3 flex-row items-start justify-between">
        <Text className="mr-3 flex-1 text-xl font-bold leading-tight text-gray-900">
          {featureRequest.title}
        </Text>
        <StatusBadge status={featureRequest.status} />
      </View>

      {/* Description */}
      <Text className="mb-4 text-base leading-6 text-gray-700">{featureRequest.description}</Text>

      {/* User info and date */}
      <View className="mb-4 flex-row items-center justify-between border-b border-gray-100 pb-3">
        <View className="flex-row items-center">
          <View className="h-6 w-6 items-center justify-center rounded-full bg-blue-100">
            <Ionicons name="person" size={12} color="#3B82F6" />
          </View>
          <Text className="ml-2 text-sm font-medium text-gray-600">Anonymous User</Text>
        </View>
        <View className="flex-row items-center">
          <Ionicons name="time-outline" size={14} color="#9CA3AF" />
          <Text className="ml-1 text-sm text-gray-500">
            {formatDate(featureRequest.created_at)}
          </Text>
        </View>
      </View>

      {/* Vote section */}
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center rounded-lg bg-gray-50 px-3 py-2">
          <Ionicons name="thumbs-up" size={16} color="#10B981" />
          <Text className="ml-2 text-sm font-semibold text-gray-800">
            {featureRequest.votes_count} votes
          </Text>
        </View>

        <View className="flex-row gap-x-3">
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
