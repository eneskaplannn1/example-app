export interface CareReminder {
  id: string;
  user_plant_id: string;
  reminder_type: string;
  reminder_time: string;
  frequency: string;
  message: string;
  last_notification_sent?: string;
}
