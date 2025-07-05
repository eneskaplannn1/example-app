import { featureRequestService } from '../../../services/featureRequestService';
import { FeatureRequestStatus } from '../../../types/featureRequest';
import { useQuery } from '@tanstack/react-query';

export function useFeatureRequests(status?: FeatureRequestStatus) {
  const {
    data: featureRequests,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['featureRequests', status],
    queryFn: () => featureRequestService.getFeatureRequests(status),
  });

  const refreshData = () => {
    refetch();
  };

  return {
    featureRequests,
    isLoading,
    error,
    refreshData,
  };
}
