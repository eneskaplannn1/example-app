export interface SupportTicket {
  id: string;
  user_id: string;
  title: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  updated_at: string;
  resolved_at?: string;
  admin_response?: string;
}

export interface CreateSupportTicketData {
  title: string;
  message: string;
  priority?: 'low' | 'medium' | 'high';
}

export interface UpdateSupportTicketData {
  title?: string;
  message?: string;
  status?: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority?: 'low' | 'medium' | 'high';
  admin_response?: string;
}
