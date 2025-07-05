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
      let query = supabase
        .from('feature_requests')
        .select(
          `
          *,
          user_vote:feature_request_votes(*)
        `
        )
        .order('votes_count', { ascending: false })
        .order('created_at', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching feature requests:', error);
      throw error;
    }
  },

  async getFeatureRequestById(id: string): Promise<FeatureRequest | null> {
    try {
      const { data, error } = await supabase
        .from('feature_requests')
        .select(
          `
          *,
          user_vote:feature_request_votes(*)
        `
        )
        .eq('id', id)
        .single();

      if (error) throw error;

      return data;
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

          // Decrease vote count
          await supabase.rpc('decrease_vote_count', {
            request_id: voteData.feature_request_id,
          });
        } else {
          // Change vote type
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

        // Increase vote count
        await supabase.rpc('increase_vote_count', {
          request_id: voteData.feature_request_id,
        });
      }
    } catch (error) {
      console.error('Error voting on feature request:', error);
      throw error;
    }
  },

  async getMostWantedRequests(limit: number = 10): Promise<FeatureRequest[]> {
    try {
      const { data, error } = await supabase
        .from('feature_requests')
        .select('*')
        .order('votes_count', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching most wanted requests:', error);
      throw error;
    }
  },
};
