import { supabase } from '../utils/supabase';
import {
  SupportTicket,
  CreateSupportTicketData,
  UpdateSupportTicketData,
} from '../types/supportTicket';

export const supportService = {
  async createSupportTicket(ticketData: CreateSupportTicketData): Promise<SupportTicket> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('support_tickets')
        .insert({
          user_id: user.id,
          title: ticketData.title,
          message: ticketData.message,
          priority: ticketData.priority || 'medium',
          status: 'open',
        })
        .select('*')
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error creating support ticket:', error);
      throw error;
    }
  },

  async getUserSupportTickets(): Promise<SupportTicket[]> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching user support tickets:', error);
      throw error;
    }
  },

  async getSupportTicket(id: string): Promise<SupportTicket | null> {
    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error fetching support ticket:', error);
      throw error;
    }
  },

  async updateSupportTicket(
    id: string,
    updates: UpdateSupportTicketData
  ): Promise<SupportTicket | null> {
    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error updating support ticket:', error);
      throw error;
    }
  },

  async closeSupportTicket(id: string): Promise<SupportTicket | null> {
    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .update({
          status: 'closed',
          resolved_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error closing support ticket:', error);
      throw error;
    }
  },
};
