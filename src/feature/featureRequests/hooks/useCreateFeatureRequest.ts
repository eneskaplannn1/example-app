import { useState } from 'react';
import { featureRequestService } from '../../../services/featureRequestService';
import { CreateFeatureRequestData, FeatureRequest } from '../../../types/featureRequest';

export function useCreateFeatureRequest() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createFeatureRequest = async (
    requestData: CreateFeatureRequestData
  ): Promise<FeatureRequest | null> => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await featureRequestService.createFeatureRequest(requestData);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create feature request');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createFeatureRequest,
    isLoading,
    error,
  };
}
