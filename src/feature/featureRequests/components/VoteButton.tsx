import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useVoteFeatureRequest } from '../hooks/useVoteFeatureRequest';
import { VoteFeatureRequestData } from '../../../types/featureRequest';
import { showToast } from '../../../components/ToastManager';

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
  const { voteFeatureRequest, isLoading, error } = useVoteFeatureRequest();

  const handleVote = async () => {
    if (disabled || isLoading) return;

    const voteData: VoteFeatureRequestData = {
      feature_request_id: featureRequestId,
      vote_type: voteType,
    };

    const success = await voteFeatureRequest(voteData);
    if (success) {
      onVoteChange();
      const action = isVoted ? 'removed' : 'added';
      const voteText = voteType === 'upvote' ? 'upvote' : 'downvote';
      showToast.success('Vote Updated', `Successfully ${action} your ${voteText}`);
    } else {
      showToast.error('Vote Failed', error || 'Unable to process your vote. Please try again.');
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
      className={`flex-row items-center rounded-lg px-4 py-2.5 ${
        isVoted
          ? isUpvote
            ? 'border-green-200 bg-green-50'
            : 'border-red-200 bg-red-50'
          : 'border-gray-200 bg-white'
      } border shadow-sm`}>
      <Ionicons name={iconName} size={18} color={isVoted ? activeColor : inactiveColor} />
      <Text
        className={`ml-2 text-sm font-semibold ${
          isVoted ? (isUpvote ? 'text-green-700' : 'text-red-700') : 'text-gray-700'
        }`}>
        {isUpvote ? 'Upvote' : 'Downvote'}
      </Text>
    </TouchableOpacity>
  );
}
