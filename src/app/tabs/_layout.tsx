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
            paddingTop: 0,
            borderTopWidth: 1,
            borderTopColor: '#E6E6E6',
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: Platform.OS === 'ios' ? 80 : 70,
            elevation: 0,
            shadowOpacity: 0,
          },
          tabBarLabelStyle: {
            fontWeight: '700',
            fontSize: 11,
          },
          lazy: true,
          freezeOnBlur: true,
          tabBarHideOnKeyboard: true,
          tabBarActiveTintColor: '#37517e',
          tabBarInactiveTintColor: '#37517e',
        }}>
        <Tabs.Screen name="index" options={{ href: null }} />
        <Tabs.Screen
          name="dashboard/index"
          options={{
            tabBarLabel: 'Dashboard',
            tabBarIcon: ({ color, size, focused }) =>
              focused ? (
                <Ionicons name="home" size={size} color={color} />
              ) : (
                <Ionicons name="home-outline" size={size} color={color} />
              ),
            headerTitle: 'Dashboard',
          }}
        />

        <Tabs.Screen
          name="feature-requests/index"
          options={{
            tabBarLabel: 'Requests',
            tabBarIcon: ({ color, size, focused }) =>
              focused ? (
                <Ionicons name="bulb" size={size} color={color} />
              ) : (
                <Ionicons name="bulb-outline" size={size} color={color} />
              ),
            headerTitle: 'Feature Requests',
          }}
        />

        <Tabs.Screen
          name="profile/index"
          options={{
            tabBarLabel: 'Profile',
            tabBarIcon: ({ color, size, focused }) =>
              focused ? (
                <Ionicons name="person" size={size} color={color} />
              ) : (
                <Ionicons name="person-outline" size={size} color={color} />
              ),
            headerTitle: 'Profile',
          }}
        />
      </Tabs>
    </View>
  );
}
