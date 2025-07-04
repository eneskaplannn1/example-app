import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useVoteFeatureRequest } from '../hooks/useVoteFeatureRequest';
import { VoteFeatureRequestData } from '../../../types/featureRequest';

interface VoteButtonProps {
  featureRequestId: string;
  voteType: 'upvote' | 'downvote';
  isVoted: boolean;
  onVoteChange: () => void;
  disabled?: boolean;
}

export function VoteButton({
  featureRequestId,
  voteType,
  isVoted,
  onVoteChange,
  disabled = false,
}: VoteButtonProps) {
  const { voteFeatureRequest, isLoading } = useVoteFeatureRequest();

  const handleVote = async () => {
    if (disabled || isLoading) return;

    const voteData: VoteFeatureRequestData = {
      feature_request_id: featureRequestId,
      vote_type: voteType,
    };

    const success = await voteFeatureRequest(voteData);
    if (success) {
      onVoteChange();
    }
  };

  const isUpvote = voteType === 'upvote';
  const iconName = isUpvote ? 'arrow-up' : 'arrow-down';
  const activeColor = isUpvote ? '#10B981' : '#EF4444';
  const inactiveColor = '#6B7280';

  return (
    <TouchableOpacity
      onPress={handleVote}
      disabled={disabled || isLoading}
      className={`flex-row items-center rounded-lg px-3 py-2 ${
        isVoted ? 'bg-gray-100' : 'bg-white'
      } border border-gray-200`}>
      <Ionicons name={iconName} size={16} color={isVoted ? activeColor : inactiveColor} />
      <Text
        className={`ml-1 text-sm font-medium ${
          isVoted ? (isUpvote ? 'text-green-600' : 'text-red-600') : 'text-gray-600'
        }`}>
        {isUpvote ? 'Upvote' : 'Downvote'}
      </Text>
    </TouchableOpacity>
  );
}
