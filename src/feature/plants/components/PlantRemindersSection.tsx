import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { CareReminder } from '../../../types/careReminder';

interface PlantRemindersSectionProps {
  reminders: CareReminder[];
  onAddReminder: () => void;
}

export function PlantRemindersSection({ reminders, onAddReminder }: PlantRemindersSectionProps) {
  return (
    <View className="p-4 mb-6 bg-white rounded-lg shadow-sm">
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-lg font-semibold text-gray-800">Care Reminders</Text>
        <TouchableOpacity className="px-3 py-1 bg-blue-500 rounded-lg" onPress={onAddReminder}>
          <Text className="text-sm font-medium text-white">Add</Text>
        </TouchableOpacity>
      </View>

      {reminders.length === 0 ? (
        <View className="items-center py-4">
          <Text className="text-gray-500">No reminders set</Text>
          <Text className="mt-1 text-sm text-gray-400">
            Tap "Add" to create your first reminder
          </Text>
        </View>
      ) : (
        reminders.map((reminder) => (
          <View
            key={reminder.id}
            className="p-3 mb-2 bg-blue-50 rounded-lg border-l-4 border-blue-400">
            <Text className="text-sm font-medium text-gray-800 capitalize">
              {reminder.reminder_type} Reminder
            </Text>
            <Text className="text-xs text-gray-600">
              {`${new Date(reminder.reminder_time).toLocaleDateString()} at ${new Date(
                reminder.reminder_time
              ).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}`}
            </Text>
            {reminder.message && (
              <Text className="mt-1 text-xs text-gray-700">{reminder.message}</Text>
            )}
          </View>
        ))
      )}
    </View>
  );
}
