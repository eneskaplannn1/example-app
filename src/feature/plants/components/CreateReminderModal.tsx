import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useCareRemindersWithNotifications } from '../hooks/useCareRemindersWithNotifications';
import { queryClient } from '../../../utils/queryClient';

interface CreateReminderModalProps {
  visible: boolean;
  onClose: () => void;
  userPlantId: string;
  plantName: string;
  onReminderCreated: () => void;
  onDashboardRefresh?: () => void;
}

const REMINDER_TYPES = [
  { value: 'watering', label: 'Watering' },
  { value: 'fertilizing', label: 'Fertilizing' },
  { value: 'pruning', label: 'Pruning' },
  { value: 'repotting', label: 'Repotting' },
  { value: 'pest_control', label: 'Pest Control' },
  { value: 'custom', label: 'Custom' },
];

export function CreateReminderModal({
  visible,
  onClose,
  userPlantId,
  plantName,
  onReminderCreated,
  onDashboardRefresh,
}: CreateReminderModalProps) {
  const [reminderType, setReminderType] = useState('watering');
  const [customType, setCustomType] = useState('');
  const [reminderDateTime, setReminderDateTime] = useState(new Date());
  const [message, setMessage] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const { createReminder, isCreating } = useCareRemindersWithNotifications();

  const handleSubmit = async () => {
    if (!reminderType) {
      Alert.alert('Error', 'Please select a reminder type');
      return;
    }

    const finalReminderType = reminderType === 'custom' ? customType : reminderType;
    if (reminderType === 'custom' && !customType.trim()) {
      Alert.alert('Error', 'Please enter a custom reminder type');
      return;
    }

    try {
      const result = await createReminder(
        {
          user_plant_id: userPlantId,
          reminder_type: finalReminderType,
          reminder_time: reminderDateTime.toISOString(),
          message: message.trim() || `Time to ${finalReminderType} your ${plantName}`,
        },
        plantName
      );

      if (result) {
        Alert.alert('Success', 'Reminder created successfully!');
        resetForm();
        onReminderCreated();
        onClose();
        onDashboardRefresh?.();
      } else {
        Alert.alert('Error', 'Failed to create reminder');
      }
    } catch (error) {
      console.error('Error creating reminder:', error);
      Alert.alert('Error', 'Failed to create reminder');
    }
  };

  const resetForm = () => {
    setReminderType('watering');
    setCustomType('');
    setReminderDateTime(new Date());
    setMessage('');
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setReminderDateTime(selectedDate);
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const currentDate = reminderDateTime;
      const newDateTime = new Date(currentDate);
      newDateTime.setHours(selectedTime.getHours());
      newDateTime.setMinutes(selectedTime.getMinutes());
      setReminderDateTime(newDateTime);
    }
  };

  const ReminderTypeOption = ({ type }: { type: { value: string; label: string } }) => (
    <TouchableOpacity
      className={`mb-2 rounded-lg border p-3 ${
        reminderType === type.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'
      }`}
      onPress={() => setReminderType(type.value)}>
      <Text className="font-medium text-gray-800">{type.label}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View className="flex-1 bg-gray-50">
        {/* Header */}
        <View className="px-4 py-4 bg-white border-b border-gray-200">
          <View className="flex-row justify-between items-center">
            <TouchableOpacity onPress={onClose}>
              <Text className="text-blue-600">Cancel</Text>
            </TouchableOpacity>
            <Text className="text-lg font-semibold text-gray-800">Create Reminder</Text>
            <View className="w-12" />
          </View>
        </View>

        <ScrollView className="flex-1 px-4 py-4">
          {/* Plant Info */}
          <View className="p-4 mb-6 bg-blue-50 rounded-lg">
            <Text className="text-sm text-blue-600">Creating reminder for:</Text>
            <Text className="text-lg font-semibold text-blue-800">{plantName}</Text>
          </View>

          {/* Reminder Type */}
          <View className="mb-6">
            <Text className="mb-3 text-lg font-semibold text-gray-800">Reminder Type</Text>
            {REMINDER_TYPES.map((type) => (
              <ReminderTypeOption key={type.value} type={type} />
            ))}

            {reminderType === 'custom' && (
              <View className="mt-2">
                <Text className="mb-2 text-sm font-medium text-gray-700">Custom Type</Text>
                <TextInput
                  className="px-3 py-2 bg-white rounded-lg border border-gray-300"
                  value={customType}
                  onChangeText={setCustomType}
                  placeholder="Enter custom reminder type"
                  placeholderTextColor="#9ca3af"
                />
              </View>
            )}
          </View>

          {/* Reminder Date and Time */}
          <View className="mb-6">
            <Text className="mb-3 text-lg font-semibold text-gray-800">Reminder Date & Time</Text>

            <View className="mb-3">
              <Text className="mb-2 text-sm font-medium text-gray-700">Date</Text>
              <TouchableOpacity
                className="px-3 py-3 bg-white rounded-lg border border-gray-300"
                onPress={() => setShowDatePicker(true)}>
                <Text className="text-gray-800">{reminderDateTime.toLocaleDateString()}</Text>
              </TouchableOpacity>
            </View>

            <View className="mb-3">
              <Text className="mb-2 text-sm font-medium text-gray-700">Time</Text>
              <TouchableOpacity
                className="px-3 py-3 bg-white rounded-lg border border-gray-300"
                onPress={() => setShowTimePicker(true)}>
                <Text className="text-gray-800">
                  {reminderDateTime.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Message */}
          <View className="mb-6">
            <Text className="mb-3 text-lg font-semibold text-gray-800">Message (Optional)</Text>
            <TextInput
              className="px-3 py-2 bg-white rounded-lg border border-gray-300"
              value={message}
              onChangeText={setMessage}
              placeholder="Add a custom message for this reminder"
              placeholderTextColor="#9ca3af"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            className={`mb-6 rounded-lg p-4 ${isCreating ? 'bg-gray-300' : 'bg-blue-500'}`}
            onPress={handleSubmit}
            disabled={isCreating}>
            {isCreating ? (
              <View className="items-center">
                <ActivityIndicator size="small" color="white" />
                <Text className="mt-1 font-medium text-white">Creating Reminder...</Text>
              </View>
            ) : (
              <Text className="font-medium text-center text-white">Create Reminder</Text>
            )}
          </TouchableOpacity>
        </ScrollView>

        {/* Date Picker */}
        {showDatePicker && (
          <DateTimePicker
            value={reminderDateTime}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}

        {/* Time Picker */}
        {showTimePicker && (
          <DateTimePicker
            value={reminderDateTime}
            mode="time"
            display="default"
            onChange={handleTimeChange}
          />
        )}
      </View>
    </Modal>
  );
}
