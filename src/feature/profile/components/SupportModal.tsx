import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { supportService } from '../../../services/supportService';

const supportTicketSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  message: z
    .string()
    .min(1, 'Message is required')
    .max(1000, 'Message must be less than 1000 characters'),
  priority: z.enum(['low', 'medium', 'high']),
});

type SupportTicketFormData = z.infer<typeof supportTicketSchema>;

interface SupportModalProps {
  visible: boolean;
  onClose: () => void;
}

export function SupportModal({ visible, onClose }: SupportModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SupportTicketFormData>({
    resolver: zodResolver(supportTicketSchema),
    defaultValues: {
      title: '',
      message: '',
      priority: 'medium',
    },
  });

  const onSubmit = async (data: SupportTicketFormData) => {
    setIsSubmitting(true);
    try {
      await supportService.createSupportTicket(data);
      Alert.alert(
        'Success',
        'Your support ticket has been submitted successfully. We will get back to you soon.',
        [
          {
            text: 'OK',
            onPress: () => {
              reset();
              onClose();
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to submit support ticket. Please try again.');
      console.error('Support ticket submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      reset();
      onClose();
    }
  };

  const priorityOptions = [
    { value: 'low', label: 'Low', color: 'text-green-600' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-600' },
    { value: 'high', label: 'High', color: 'text-red-600' },
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}>
      <View className="flex-1 bg-gray-50">
        {/* Header */}
        <View className="flex-row justify-between items-center p-4 bg-white border-b border-gray-200">
          <Text className="text-xl font-bold text-gray-800">Contact Support</Text>
          <TouchableOpacity onPress={handleClose} disabled={isSubmitting} className="p-2">
            <Ionicons name="close" size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
          <View className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <Text className="mb-2 text-lg font-semibold text-gray-800">
              Submit a Support Ticket
            </Text>
            <Text className="mb-6 text-gray-600">
              Please provide details about your issue and we&apos;ll get back to you as soon as
              possible.
            </Text>

            {/* Title Input */}
            <View className="mb-4">
              <Text className="mb-2 text-sm font-medium text-gray-700">Title *</Text>
              <Controller
                control={control}
                name="title"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className={`rounded-xl border px-4 py-3 text-gray-800 ${
                      errors.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Brief description of your issue"
                    placeholderTextColor="#9CA3AF"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    editable={!isSubmitting}
                  />
                )}
              />
              {errors.title && (
                <Text className="mt-1 text-sm text-red-500">{errors.title.message}</Text>
              )}
            </View>

            {/* Priority Selection */}
            <View className="mb-4">
              <Text className="mb-2 text-sm font-medium text-gray-700">Priority</Text>
              <View className="flex-row gap-x-2">
                {priorityOptions.map((option) => (
                  <Controller
                    key={option.value}
                    control={control}
                    name="priority"
                    render={({ field: { onChange, value } }) => (
                      <TouchableOpacity
                        onPress={() => onChange(option.value)}
                        disabled={isSubmitting}
                        className={`flex-1 rounded-lg border px-3 py-2 ${
                          value === option.value
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-300 bg-gray-50'
                        }`}>
                        <Text
                          className={`text-center text-sm font-medium ${
                            value === option.value ? 'text-blue-600' : option.color
                          }`}>
                          {option.label}
                        </Text>
                      </TouchableOpacity>
                    )}
                  />
                ))}
              </View>
            </View>

            {/* Message Input */}
            <View className="mb-6">
              <Text className="mb-2 text-sm font-medium text-gray-700">Message *</Text>
              <Controller
                control={control}
                name="message"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className={`rounded-xl border px-4 py-3 text-gray-800 ${
                      errors.message ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Please describe your issue in detail..."
                    placeholderTextColor="#9CA3AF"
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                    multiline
                    numberOfLines={6}
                    textAlignVertical="top"
                    editable={!isSubmitting}
                  />
                )}
              />
              {errors.message && (
                <Text className="mt-1 text-sm text-red-500">{errors.message.message}</Text>
              )}
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              className={`rounded-xl px-6 py-4 ${isSubmitting ? 'bg-gray-400' : 'bg-blue-600'}`}>
              {isSubmitting ? (
                <View className="flex-row justify-center items-center">
                  <ActivityIndicator color="white" size="small" />
                  <Text className="ml-2 font-semibold text-white">Submitting...</Text>
                </View>
              ) : (
                <Text className="font-semibold text-center text-white">Submit Ticket</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}
