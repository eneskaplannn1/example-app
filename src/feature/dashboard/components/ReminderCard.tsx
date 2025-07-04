import React from 'react';
import { View, Text } from 'react-native';
import { CareReminder } from '../../../types/careReminder';

interface ReminderCardProps {
  reminder: CareReminder;
}

export function ReminderCard({ reminder }: ReminderCardProps) {
  return (
    <View className="mb-2 rounded-lg border-l-4 border-blue-400 bg-blue-50 p-3">
      <Text className="text-sm font-medium capitalize text-gray-800">
        {reminder.reminder_type} Reminder
      </Text>
      <Text className="text-xs text-gray-600">
        {new Date(reminder.reminder_time).toLocaleDateString()}
      </Text>
      {reminder.message && <Text className="mt-1 text-xs text-gray-700">{reminder.message}</Text>}
    </View>
  );
}
