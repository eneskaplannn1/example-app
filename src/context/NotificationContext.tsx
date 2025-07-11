import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { notificationService } from '../services/notificationService';
import { useRouter } from 'expo-router';
import { useAuth } from './AuthContext';

interface NotificationContextProps {
  isInitialized: boolean;
  expoPushToken: string | null;
  initializeNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useAuth();

  const initializeNotifications = async () => {
    try {
      await notificationService.initialize();
      const token = notificationService.getExpoPushToken();
      setExpoPushToken(token);

      // Register user with Supabase notification system if authenticated
      if (token && user?.id) {
        try {
          const success = await notificationService.registerUserWithSupabase(user.id);
          if (!success) {
            console.error('Failed to register user with notification system');
          }
        } catch (error) {
          console.error('Error registering user with notification system:', error);
        }
      }

      setIsInitialized(true);
    } catch (error) {
      console.error('Error initializing notifications:', error);
    }
  };

  useEffect(() => {
    initializeNotifications();

    // Set up notification listeners
    const cleanup = notificationService.setupNotificationListeners(
      (notification) => {
        // Handle notification received while app is in foreground
      },
      (response) => {
        // Handle notification tap
        const data = response.notification.request.content.data;
        if (data?.userPlantId) {
          // Navigate to plant detail page
          router.push(`/plants/${data.userPlantId}`);
        }
      }
    );

    return cleanup;
  }, [router, user?.id]);

  // Cleanup when user logs out
  useEffect(() => {
    if (!user?.id && notificationService.isUserRegistered()) {
      // User logged out, unregister from notifications
      notificationService.unregisterUserFromSupabase(user?.id || '');
    }
  }, [user?.id]);

  return (
    <NotificationContext.Provider
      value={{
        isInitialized,
        expoPushToken,
        initializeNotifications,
      }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
}
