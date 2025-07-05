import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

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
        console.log('Failed to get push token for push notification!');
        return;
      }

      // Get the token
      if (Device.isDevice) {
        const token = await Notifications.getExpoPushTokenAsync({
          projectId: process.env.EXPO_PROJECT_ID,
        });
        this.expoPushToken = token.data;
        console.log('Expo push token:', this.expoPushToken);
      } else {
        console.log('Must use physical device for Push Notifications');
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

  async scheduleCareReminder(reminder: {
    id: string;
    user_plant_id: string;
    reminder_type: string;
    reminder_time: string;
    message: string;
    plantName?: string;
  }): Promise<string | null> {
    try {
      const scheduledDate = new Date(reminder.reminder_time);
      const now = new Date();

      // Don't schedule if the reminder time has already passed
      if (scheduledDate <= now) {
        console.log('Reminder time has already passed:', scheduledDate);
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
        trigger: secondsUntilScheduled > 0 ? { seconds: secondsUntilScheduled } : null,
      });

      console.log('Scheduled notification:', notificationId, 'for:', scheduledDate);
      return notificationId;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      return null;
    }
  }

  async cancelNotification(notificationId: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      console.log('Cancelled notification:', notificationId);
    } catch (error) {
      console.error('Error cancelling notification:', error);
    }
  }

  async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log('Cancelled all notifications');
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
}

export const notificationService = NotificationService.getInstance();
