import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Platform, View } from 'react-native';

export default function TabsLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarStyle: {
            backgroundColor: '#ffffff',
            shadowColor: '#000000',
            paddingTop: 8,
            paddingBottom: Platform.OS === 'ios' ? 20 : 12,
            borderTopWidth: 0,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            position: 'absolute',
            bottom: 0,
            left: 8,
            right: 8,
            height: Platform.OS === 'ios' ? 90 : 80,
            elevation: 8,
            shadowOffset: {
              width: 0,
              height: -4,
            },
            shadowOpacity: 0.1,
            shadowRadius: 12,
          },
          tabBarLabelStyle: {
            fontWeight: '600',
            fontSize: 12,
            marginTop: 4,
          },
          tabBarIconStyle: {
            marginTop: 4,
          },
          lazy: true,
          freezeOnBlur: true,
          tabBarHideOnKeyboard: true,
          tabBarActiveTintColor: '#3b82f6',
          tabBarInactiveTintColor: '#94a3b8',
          headerStyle: {
            backgroundColor: '#ffffff',
            shadowColor: '#000000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 4,
          },
          headerTitleStyle: {
            fontWeight: '700',
            fontSize: 18,
            color: '#1e293b',
          },
        }}>
        <Tabs.Screen name="index" options={{ href: null }} />
        <Tabs.Screen
          name="dashboard/index"
          options={{
            tabBarLabel: 'Dashboard',
            tabBarIcon: ({ color, size, focused }) => (
              <View style={{ alignItems: 'center' }}>
                <Ionicons name="home-outline" size={size} color={color} />
              </View>
            ),
            headerTitle: 'Dashboard',
          }}
        />

        <Tabs.Screen
          name="feature-requests/index"
          options={{
            tabBarLabel: 'Requests',
            tabBarIcon: ({ color, size, focused }) => (
              <View style={{ alignItems: 'center' }}>
                <Ionicons name="bulb-outline" size={size} color={color} />
              </View>
            ),
            headerTitle: 'Feature Requests',
          }}
        />

        <Tabs.Screen
          name="profile/index"
          options={{
            tabBarLabel: 'Profile',
            tabBarIcon: ({ color, size, focused }) => (
              <View style={{ alignItems: 'center' }}>
                <Ionicons name="person-outline" size={size} color={color} />
              </View>
            ),
            headerTitle: 'Profile',
          }}
        />
      </Tabs>
    </View>
  );
}
