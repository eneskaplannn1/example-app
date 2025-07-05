import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { notificationService } from '../services/notificationService';
import * as Notifications from 'expo-notifications';

export function NotificationDebugger() {
  const [scheduledNotifications, setScheduledNotifications] = useState<
    Notifications.NotificationRequest[]
  >([]);
  const [isVisible, setIsVisible] = useState(false);

  const loadScheduledNotifications = async () => {
    try {
      const notifications = await notificationService.getScheduledNotifications();
      setScheduledNotifications(notifications);
    } catch (error) {
      console.error('Error loading scheduled notifications:', error);
    }
  };

  const sendTestNotification = async () => {
    try {
      await notificationService.sendImmediateNotification(
        'Test Notification',
        'This is a test notification from your plant care app!',
        { test: true }
      );
      Alert.alert('Success', 'Test notification sent!');
    } catch (error) {
      console.error('Error sending test notification:', error);
      Alert.alert('Error', 'Failed to send test notification');
    }
  };

  const clearAllNotifications = async () => {
    try {
      await notificationService.cancelAllNotifications();
      await loadScheduledNotifications();
      Alert.alert('Success', 'All notifications cleared!');
    } catch (error) {
      console.error('Error clearing notifications:', error);
      Alert.alert('Error', 'Failed to clear notifications');
    }
  };

  useEffect(() => {
    if (isVisible) {
      loadScheduledNotifications();
    }
  }, [isVisible]);

  if (!isVisible) {
    return (
      <TouchableOpacity
        className="absolute bottom-20 right-4 rounded-full bg-blue-500 p-3"
        onPress={() => setIsVisible(true)}>
        <Text className="font-bold text-white">🔔</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View className="absolute inset-0 items-center justify-center bg-black bg-opacity-50">
      <View className="m-4 max-h-96 w-80 rounded-lg bg-white p-4">
        <View className="mb-4 flex-row items-center justify-between">
          <Text className="text-lg font-bold">Notification Debugger</Text>
          <TouchableOpacity onPress={() => setIsVisible(false)}>
            <Text className="text-blue-500">✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1">
          <View className="mb-4">
            <Text className="mb-2 font-semibold">
              Scheduled Notifications ({scheduledNotifications.length})
            </Text>
            {scheduledNotifications.length === 0 ? (
              <Text className="text-gray-500">No scheduled notifications</Text>
            ) : (
              scheduledNotifications.map((notification, index) => (
                <View key={index} className="mb-2 rounded bg-gray-100 p-2">
                  <Text className="font-medium">{notification.content.title}</Text>
                  <Text className="text-sm text-gray-600">{notification.content.body}</Text>
                  <Text className="text-xs text-gray-500">ID: {notification.identifier}</Text>
                </View>
              ))
            )}
          </View>

          <View className="space-y-2">
            <TouchableOpacity className="rounded bg-blue-500 p-2" onPress={sendTestNotification}>
              <Text className="text-center text-white">Send Test Notification</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="rounded bg-green-500 p-2"
              onPress={loadScheduledNotifications}>
              <Text className="text-center text-white">Refresh</Text>
            </TouchableOpacity>

            <TouchableOpacity className="rounded bg-red-500 p-2" onPress={clearAllNotifications}>
              <Text className="text-center text-white">Clear All</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
