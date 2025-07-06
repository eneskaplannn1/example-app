import { featureRequestService } from '../../../services/featureRequestService';
import { FeatureRequestStatus } from '../../../types/featureRequest';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../../context/AuthContext';

export function useFeatureRequests(status?: FeatureRequestStatus) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: featureRequests,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['featureRequests', status, user?.id],
    queryFn: () => featureRequestService.getFeatureRequests(status),
    enabled: !!user?.id,
  });

  const refreshData = () => {
    // Invalidate and refetch to ensure fresh data
    queryClient.invalidateQueries({ queryKey: ['featureRequests', status, user?.id] });
  };

  return {
    featureRequests,
    isLoading,
    error,
    refreshData,
  };
}
