import React from 'react';
import { View, Text, TouchableOpacity, Linking, Alert } from 'react-native';

export function SupportSection() {
  const handleContactSupport = () => {
    Alert.alert('Contact Support', 'How would you like to contact support?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Email',
        onPress: () => {
          Linking.openURL('mailto:support@plantcareapp.com?subject=Support Request');
        },
      },
      {
        text: 'Website',
        onPress: () => {
          Linking.openURL('https://plantcareapp.com/support');
        },
      },
    ]);
  };

  const handleFAQ = () => {
    Alert.alert('FAQ', 'Frequently Asked Questions', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'View FAQ',
        onPress: () => {
          Linking.openURL('https://plantcareapp.com/faq');
        },
      },
    ]);
  };

  const handlePrivacyPolicy = () => {
    Linking.openURL('https://plantcareapp.com/privacy');
  };

  const handleTermsOfService = () => {
    Linking.openURL('https://plantcareapp.com/terms');
  };

  return (
    <View className="mb-6">
      <Text className="mb-3 text-lg font-semibold text-gray-800">Support & Legal</Text>
      <View className="rounded-lg bg-white shadow-sm">
        <TouchableOpacity
          onPress={handleContactSupport}
          className="flex-row items-center border-b border-gray-100 p-4">
          <Text className="mr-3 text-2xl">📧</Text>
          <View className="flex-1">
            <Text className="font-medium text-gray-800">Contact Support</Text>
            <Text className="text-sm text-gray-500">Get help with your account or app</Text>
          </View>
          <Text className="text-gray-400">›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleFAQ}
          className="flex-row items-center border-b border-gray-100 p-4">
          <Text className="mr-3 text-2xl">❓</Text>
          <View className="flex-1">
            <Text className="font-medium text-gray-800">FAQ</Text>
            <Text className="text-sm text-gray-500">Frequently asked questions</Text>
          </View>
          <Text className="text-gray-400">›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handlePrivacyPolicy}
          className="flex-row items-center border-b border-gray-100 p-4">
          <Text className="mr-3 text-2xl">🔒</Text>
          <View className="flex-1">
            <Text className="font-medium text-gray-800">Privacy Policy</Text>
            <Text className="text-sm text-gray-500">How we protect your data</Text>
          </View>
          <Text className="text-gray-400">›</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleTermsOfService} className="flex-row items-center p-4">
          <Text className="mr-3 text-2xl">📄</Text>
          <View className="flex-1">
            <Text className="font-medium text-gray-800">Terms of Service</Text>
            <Text className="text-sm text-gray-500">App usage terms and conditions</Text>
          </View>
          <Text className="text-gray-400">›</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
