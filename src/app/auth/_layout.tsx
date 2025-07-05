import { Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function AuthLayout() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.replace('/tabs/dashboard');
    }
  }, [user, isLoading, router]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" options={{ title: 'Login' }} />
      <Stack.Screen name="signup" options={{ title: 'Sign Up' }} />
    </Stack>
  );
}
