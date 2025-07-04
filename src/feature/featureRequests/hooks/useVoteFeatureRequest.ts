import { useState } from 'react';
import { featureRequestService } from '../../../services/featureRequestService';
import { VoteFeatureRequestData } from '../../../types/featureRequest';

export function useVoteFeatureRequest() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const voteFeatureRequest = async (voteData: VoteFeatureRequestData): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      await featureRequestService.voteFeatureRequest(voteData);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to vote on feature request');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    voteFeatureRequest,
    isLoading,
    error,
  };
}
