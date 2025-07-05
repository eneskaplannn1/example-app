import { createClient } from '@supabase/supabase-js';

interface CareReminder {
  id: string;
  user_plant_id: string;
  reminder_type: string;
  reminder_time: string;
  message: string;
  user_plants: {
    user_id: string;
    nickname?: string;
    plants?: {
      common_name?: string;
    };
  };
  users: {
    expo_push_token: string;
  };
}

interface NotificationPayload {
  to: string;
  sound: 'default';
  title: string;
  body: string;
  data: {
    reminderId: string;
    userPlantId: string;
    reminderType: string;
    plantName: string;
  };
}

export class NotificationCronService {
  private supabase: any;
  private expoApiUrl = 'https://exp.host/--/api/v2/push/send';

  constructor() {
    this.supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  }

  async getDueReminders(): Promise<CareReminder[]> {
    const now = new Date();
    const { data, error } = await this.supabase
      .from('care_reminders')
      .select(
        `
        *,
        user_plants!inner(
          user_id,
          nickname,
          plants(common_name)
        ),
        users!inner(expo_push_token)
      `
      )
      .lte('reminder_time', now.toISOString())
      .is('sent', null); // Only get unsent reminders

    if (error) {
      console.error('Error fetching due reminders:', error);
      return [];
    }

    return data || [];
  }

  async markReminderAsSent(reminderId: string): Promise<void> {
    const { error } = await this.supabase
      .from('care_reminders')
      .update({ sent: new Date().toISOString() })
      .eq('id', reminderId);

    if (error) {
      console.error('Error marking reminder as sent:', error);
    }
  }

  async sendPushNotification(payload: NotificationPayload): Promise<boolean> {
    try {
      const response = await fetch(this.expoApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.data?.status === 'error') {
        console.error('Expo push notification error:', result.data.message);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error sending push notification:', error);
      return false;
    }
  }

  async processDueReminders(): Promise<void> {
    console.log('Starting to process due reminders...');

    const dueReminders = await this.getDueReminders();
    console.log(`Found ${dueReminders.length} due reminders`);

    for (const reminder of dueReminders) {
      try {
        const plantName =
          reminder.user_plants.nickname || reminder.user_plants.plants?.common_name || 'Plant';

        const payload: NotificationPayload = {
          to: reminder.users.expo_push_token,
          sound: 'default',
          title: `${reminder.reminder_type.charAt(0).toUpperCase() + reminder.reminder_type.slice(1)} Reminder`,
          body: reminder.message || `Time to ${reminder.reminder_type} your ${plantName}!`,
          data: {
            reminderId: reminder.id,
            userPlantId: reminder.user_plant_id,
            reminderType: reminder.reminder_type,
            plantName,
          },
        };

        const success = await this.sendPushNotification(payload);

        if (success) {
          await this.markReminderAsSent(reminder.id);
          console.log(`Notification sent successfully for reminder ${reminder.id}`);
        } else {
          console.error(`Failed to send notification for reminder ${reminder.id}`);
        }
      } catch (error) {
        console.error(`Error processing reminder ${reminder.id}:`, error);
      }
    }

    console.log('Finished processing due reminders');
  }

  // Method to clean up old sent reminders (optional)
  async cleanupOldReminders(daysToKeep: number = 30): Promise<void> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const { error } = await this.supabase
      .from('care_reminders')
      .delete()
      .lt('sent', cutoffDate.toISOString());

    if (error) {
      console.error('Error cleaning up old reminders:', error);
    } else {
      console.log('Cleaned up old reminders');
    }
  }
}

// Export singleton instance
export const notificationCronService = new NotificationCronService();
