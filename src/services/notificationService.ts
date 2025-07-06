import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { supabase } from '../utils/supabase';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export interface NotificationData {
  id: string;
  title: string;
  body: string;
  data?: any;
  scheduledDate: Date;
}

export class NotificationService {
  private static instance: NotificationService;
  private expoPushToken: string | null = null;
  private isRegisteredWithSupabase: boolean = false;

  private constructor() {}

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  async initialize(): Promise<void> {
    try {
      // Request permissions
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        return;
      }

      // Get the token
      if (Device.isDevice) {
        const token = await Notifications.getExpoPushTokenAsync({
          projectId: process.env.EXPO_PROJECT_ID,
        });
        this.expoPushToken = token.data;
      }

      // Set up notification channel for Android
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }
    } catch (error) {
      console.error('Error initializing notifications:', error);
    }
  }

  async registerUserWithSupabase(userId: string): Promise<boolean> {
    try {
      if (!this.expoPushToken) {
        console.error('No Expo push token available');
        return false;
      }

      const deviceId = await this.getDeviceId();

      // Remove existing registration for this device
      await supabase.from('notification_users').delete().eq('device_id', deviceId);

      // Register user with new token
      const { error } = await supabase.from('notification_users').insert([
        {
          user_id: userId,
          push_token: this.expoPushToken,
          device_id: deviceId,
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) {
        console.error('Error registering user with Supabase:', error);
        return false;
      }

      this.isRegisteredWithSupabase = true;
      console.log(`User ${userId} registered for notifications`);
      return true;
    } catch (error) {
      console.error('Error registering user with Supabase:', error);
      return false;
    }
  }

  async unregisterUserFromSupabase(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase.from('notification_users').delete().eq('user_id', userId);

      if (error) {
        console.error('Error unregistering user from Supabase:', error);
        return false;
      }

      this.isRegisteredWithSupabase = false;
      console.log(`User ${userId} unregistered from notifications`);
      return true;
    } catch (error) {
      console.error('Error unregistering user from Supabase:', error);
      return false;
    }
  }

  async scheduleCareReminder(reminder: {
    id: string;
    user_plant_id: string;
    reminder_type: string;
    reminder_time: string;
    frequency: string;
    message: string;
    plantName?: string;
  }): Promise<string | null> {
    try {
      const scheduledDate = new Date(reminder.reminder_time);
      const now = new Date();

      // Don't schedule if the reminder time has already passed
      if (scheduledDate <= now) {
        return null;
      }

      // Calculate seconds from now until the scheduled time
      const secondsUntilScheduled = Math.floor((scheduledDate.getTime() - now.getTime()) / 1000);

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: `${reminder.reminder_type.charAt(0).toUpperCase() + reminder.reminder_type.slice(1)} Reminder`,
          body: reminder.message || `Time to ${reminder.reminder_type} your plant!`,
          data: {
            reminderId: reminder.id,
            userPlantId: reminder.user_plant_id,
            reminderType: reminder.reminder_type,
            plantName: reminder.plantName,
          },
          sound: 'default',
        },
        trigger:
          secondsUntilScheduled > 0
            ? {
                type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
                seconds: secondsUntilScheduled,
              }
            : null,
      });

      return notificationId;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      return null;
    }
  }

  async cancelNotification(notificationId: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch (error) {
      console.error('Error cancelling notification:', error);
    }
  }

  async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error cancelling all notifications:', error);
    }
  }

  async getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
    try {
      return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error getting scheduled notifications:', error);
      return [];
    }
  }

  async sendImmediateNotification(title: string, body: string, data?: any): Promise<void> {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          sound: 'default',
        },
        trigger: null, // Send immediately
      });
    } catch (error) {
      console.error('Error sending immediate notification:', error);
    }
  }

  getExpoPushToken(): string | null {
    return this.expoPushToken;
  }

  isUserRegistered(): boolean {
    return this.isRegisteredWithSupabase;
  }

  // Set up notification listeners
  setupNotificationListeners(
    onNotificationReceived: (notification: Notifications.Notification) => void,
    onNotificationResponseReceived: (response: Notifications.NotificationResponse) => void
  ): () => void {
    const notificationListener =
      Notifications.addNotificationReceivedListener(onNotificationReceived);
    const responseListener = Notifications.addNotificationResponseReceivedListener(
      onNotificationResponseReceived
    );

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }

  private async getDeviceId(): Promise<string> {
    // Use a combination of device info to create a unique device ID
    const deviceName = Device.deviceName || 'unknown';
    const deviceType = Device.deviceType || 'unknown';
    const osVersion = Device.osVersion || 'unknown';

    // Create a simple hash-like identifier
    const deviceString = `${deviceName}-${deviceType}-${osVersion}-${Platform.OS}`;
    return btoa(deviceString)
      .replace(/[^a-zA-Z0-9]/g, '')
      .substring(0, 32);
  }
}

export const notificationService = NotificationService.getInstance();
