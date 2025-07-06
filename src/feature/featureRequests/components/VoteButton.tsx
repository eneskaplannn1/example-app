import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useVoteFeatureRequest } from '../hooks/useVoteFeatureRequest';
import { VoteFeatureRequestData } from '../../../types/featureRequest';
import { showToast } from '../../../components/ToastManager';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../../context/AuthContext';

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
  const queryClient = useQueryClient();
  const { user } = useAuth();

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
      // Invalidate both feature requests and dashboard caches
      queryClient.invalidateQueries({ queryKey: ['featureRequests'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    } else {
      showToast.error('Vote Failed', error || 'Unable to process your vote. Please try again.');
    }
  };

  const isUpvote = voteType === 'upvote';
  const iconName = isUpvote
    ? isVoted
      ? 'thumbs-up'
      : 'thumbs-up-outline'
    : isVoted
      ? 'thumbs-down'
      : 'thumbs-down-outline';

  const activeColor = isUpvote ? '#10B981' : '#EF4444';
  const inactiveColor = '#6B7280';
  const backgroundColor = isVoted ? (isUpvote ? 'bg-green-50' : 'bg-red-50') : 'bg-gray-50';
  const borderColor = isVoted
    ? isUpvote
      ? 'border-green-200'
      : 'border-red-200'
    : 'border-gray-200';

  return (
    <TouchableOpacity
      onPress={handleVote}
      disabled={disabled || isLoading}
      className={`h-12 w-12 items-center justify-center rounded-xl border shadow-sm ${backgroundColor} ${borderColor}`}
      style={{
        opacity: disabled || isLoading ? 0.6 : 1,
      }}>
      <Ionicons name={iconName} size={20} color={isVoted ? activeColor : inactiveColor} />
    </TouchableOpacity>
  );
}
