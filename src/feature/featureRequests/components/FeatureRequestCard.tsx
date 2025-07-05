import { View, Text } from 'react-native';
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
    <View className="p-5 mb-4 bg-white rounded-xl border border-gray-100 shadow-lg shadow-gray-200/50">
      {/* Header with title and status */}
      <View className="flex-row justify-between items-start mb-3">
        <Text className="flex-1 mr-3 text-xl font-bold leading-tight text-gray-900">
          {featureRequest.title}
        </Text>
        <StatusBadge status={featureRequest.status} />
      </View>

      {/* Description */}
      <Text className="mb-4 text-base leading-6 text-gray-700">{featureRequest.description}</Text>

      {/* User info and date */}
      <View className="flex-row justify-between items-center pb-3 mb-4 border-b border-gray-100">
        <View className="flex-row items-center">
          <View className="justify-center items-center w-6 h-6 bg-blue-100 rounded-full">
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
      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center px-3 py-2 bg-gray-50 rounded-lg">
          <Ionicons name="thumbs-up" size={16} color="#10B981" />
          <Text className="ml-2 text-sm font-semibold text-gray-800">
            {featureRequest.votes_count} votes
          </Text>
        </View>

        <View className="flex-row gap-x-2">
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
