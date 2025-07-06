export interface FeatureRequest {
  id: string;
  title: string;
  description: string;
  status: FeatureRequestStatus;
  votes_count: number;
  user_id: string;
  created_at: string;
  updated_at: string;
  user_vote?: FeatureRequestVote | null;
}

export interface FeatureRequestVote {
  id: string;
  feature_request_id: string;
  user_id: string;
  vote_type: 'upvote' | 'downvote';
  created_at: string;
}

export type FeatureRequestStatus =
  | 'pending'
  | 'under_review'
  | 'in_progress'
  | 'completed'
  | 'rejected';

export interface CreateFeatureRequestData {
  title: string;
  description: string;
}

export interface UpdateFeatureRequestData {
  title?: string;
  description?: string;
  status?: FeatureRequestStatus;
}

export interface VoteFeatureRequestData {
  feature_request_id: string;
  vote_type: 'upvote' | 'downvote';
}
