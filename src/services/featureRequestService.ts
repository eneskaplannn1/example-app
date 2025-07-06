import { supabase } from '../utils/supabase';
import {
  FeatureRequest,
  CreateFeatureRequestData,
  UpdateFeatureRequestData,
  VoteFeatureRequestData,
  FeatureRequestStatus,
} from '../types/featureRequest';

export const featureRequestService = {
  async getFeatureRequests(status?: FeatureRequestStatus): Promise<FeatureRequest[]> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error('User not authenticated');

      let query = supabase
        .from('feature_requests')
        .select('*')
        .order('votes_count', { ascending: false })
        .order('created_at', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const { data: featureRequests, error } = await query;

      if (error) throw error;

      if (!featureRequests || featureRequests.length === 0) {
        return [];
      }

      // Get all feature request IDs
      const featureRequestIds = featureRequests.map((fr) => fr.id);

      // Get current user's votes for these feature requests
      const { data: userVotes, error: votesError } = await supabase
        .from('feature_request_votes')
        .select('*')
        .eq('user_id', user.id)
        .in('feature_request_id', featureRequestIds);

      if (votesError) {
        console.error('Error fetching user votes:', votesError);
      }

      // Create a map of user votes for quick lookup
      const userVotesMap = new Map();
      if (userVotes) {
        userVotes.forEach((vote) => {
          userVotesMap.set(vote.feature_request_id, vote);
        });
      }

      // Combine feature requests with user votes
      const result = featureRequests.map((featureRequest) => ({
        ...featureRequest,
        user_vote: userVotesMap.get(featureRequest.id) || null,
      }));

      return result;
    } catch (error) {
      console.error('Error fetching feature requests:', error);
      throw error;
    }
  },

  async getFeatureRequestById(id: string): Promise<FeatureRequest | null> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error('User not authenticated');

      // Get the feature request
      const { data: featureRequest, error } = await supabase
        .from('feature_requests')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (!featureRequest) {
        return null;
      }

      // Get user's vote for this feature request
      const { data: userVote, error: voteError } = await supabase
        .from('feature_request_votes')
        .select('*')
        .eq('feature_request_id', id)
        .eq('user_id', user.id)
        .single();

      if (voteError && voteError.code !== 'PGRST116') {
        console.error('Error fetching user vote:', voteError);
      }

      return {
        ...featureRequest,
        user_vote: userVote || null,
      };
    } catch (error) {
      console.error('Error fetching feature request:', error);
      throw error;
    }
  },

  async createFeatureRequest(requestData: CreateFeatureRequestData): Promise<FeatureRequest> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('feature_requests')
        .insert({
          title: requestData.title,
          description: requestData.description,
          user_id: user.id,
          status: 'pending',
          votes_count: 0,
        })
        .select('*')
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error creating feature request:', error);
      throw error;
    }
  },

  async updateFeatureRequest(
    id: string,
    updateData: UpdateFeatureRequestData
  ): Promise<FeatureRequest> {
    try {
      const { data, error } = await supabase
        .from('feature_requests')
        .update(updateData)
        .eq('id', id)
        .select('*')
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error updating feature request:', error);
      throw error;
    }
  },

  async deleteFeatureRequest(id: string): Promise<void> {
    try {
      const { error } = await supabase.from('feature_requests').delete().eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting feature request:', error);
      throw error;
    }
  },

  async voteFeatureRequest(voteData: VoteFeatureRequestData): Promise<void> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error('User not authenticated');

      // Check if user already voted
      const { data: existingVote } = await supabase
        .from('feature_request_votes')
        .select('*')
        .eq('feature_request_id', voteData.feature_request_id)
        .eq('user_id', user.id)
        .single();

      if (existingVote) {
        // Update existing vote
        if (existingVote.vote_type === voteData.vote_type) {
          // Remove vote if same type
          await supabase.from('feature_request_votes').delete().eq('id', existingVote.id);

          // Get current vote count and decrease it
          const { data: currentRequest } = await supabase
            .from('feature_requests')
            .select('votes_count')
            .eq('id', voteData.feature_request_id)
            .single();

          if (currentRequest) {
            await supabase
              .from('feature_requests')
              .update({ votes_count: Math.max(0, currentRequest.votes_count - 1) })
              .eq('id', voteData.feature_request_id);
          }
        } else {
          // Change vote type - no change in total count
          await supabase
            .from('feature_request_votes')
            .update({ vote_type: voteData.vote_type })
            .eq('id', existingVote.id);
        }
      } else {
        // Create new vote
        await supabase.from('feature_request_votes').insert({
          feature_request_id: voteData.feature_request_id,
          user_id: user.id,
          vote_type: voteData.vote_type,
        });

        // Get current vote count and increase it
        const { data: currentRequest } = await supabase
          .from('feature_requests')
          .select('votes_count')
          .eq('id', voteData.feature_request_id)
          .single();

        if (currentRequest) {
          await supabase
            .from('feature_requests')
            .update({ votes_count: currentRequest.votes_count + 1 })
            .eq('id', voteData.feature_request_id);
        }
      }
    } catch (error) {
      console.error('Error voting on feature request:', error);
      throw error;
    }
  },

  async getMostWantedRequests(limit: number = 10): Promise<FeatureRequest[]> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error('User not authenticated');

      // Get most wanted feature requests
      const { data: featureRequests, error } = await supabase
        .from('feature_requests')
        .select('*')
        .order('votes_count', { ascending: false })
        .limit(limit);

      if (error) throw error;

      if (!featureRequests || featureRequests.length === 0) {
        return [];
      }

      // Get all feature request IDs
      const featureRequestIds = featureRequests.map((fr) => fr.id);

      // Get current user's votes for these feature requests
      const { data: userVotes, error: votesError } = await supabase
        .from('feature_request_votes')
        .select('*')
        .eq('user_id', user.id)
        .in('feature_request_id', featureRequestIds);

      if (votesError) {
        console.error('Error fetching user votes:', votesError);
      }

      // Create a map of user votes for quick lookup
      const userVotesMap = new Map();
      if (userVotes) {
        userVotes.forEach((vote) => {
          userVotesMap.set(vote.feature_request_id, vote);
        });
      }

      // Combine feature requests with user votes
      const result = featureRequests.map((featureRequest) => ({
        ...featureRequest,
        user_vote: userVotesMap.get(featureRequest.id) || null,
      }));

      return result;
    } catch (error) {
      console.error('Error fetching most wanted requests:', error);
      throw error;
    }
  },
};
