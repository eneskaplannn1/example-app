import { useState, useEffect } from 'react';
import { featureRequestService } from '../../../services/featureRequestService';
import { FeatureRequest, FeatureRequestStatus } from '../../../types/featureRequest';

export function useFeatureRequests(status?: FeatureRequestStatus) {
  const [featureRequests, setFeatureRequests] = useState<FeatureRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeatureRequests = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await featureRequestService.getFeatureRequests(status);
      setFeatureRequests(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch feature requests');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeatureRequests();
  }, [status]);

  const refreshData = () => {
    fetchFeatureRequests();
  };

  return {
    featureRequests,
    isLoading,
    error,
    refreshData,
  };
}
