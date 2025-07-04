import React from 'react';
import { View, Text } from 'react-native';
import { CareReminder } from '../../../types/careReminder';
import { ReminderCard } from './ReminderCard';

interface RemindersSectionProps {
  careReminders: CareReminder[];
}

export function RemindersSection({ careReminders }: RemindersSectionProps) {
  if (careReminders.length === 0) return null;

  return (
    <View className="px-4 py-4">
      <Text className="mb-3 text-lg font-semibold text-gray-800">Care Reminders</Text>
      {careReminders.slice(0, 3).map((reminder) => (
        <ReminderCard key={reminder.id} reminder={reminder} />
      ))}
    </View>
  );
}
