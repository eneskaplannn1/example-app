import '../../global.css';
import { Stack } from 'expo-router';
import { AuthProvider } from '../context/AuthContext';
import { NotificationProvider } from '../context/NotificationContext';
import { queryClient } from '../utils/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { ToastManager } from '../components/ToastManager';

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NotificationProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="auth" options={{ headerShown: false }} />
            <Stack.Screen name="tabs" options={{ headerShown: false }} />
          </Stack>
          <ToastManager />
        </NotificationProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
