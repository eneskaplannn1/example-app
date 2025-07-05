import React, { useState } from 'react';
import { View, Text, Linking, Alert } from 'react-native';
import { ProfileRow } from './ProfileRow';
import { SupportModal } from './SupportModal';

export function SupportSection() {
  const [isSupportModalVisible, setIsSupportModalVisible] = useState(false);

  const handleContactSupport = () => {
    setIsSupportModalVisible(true);
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
      <Text className="mb-4 text-xl font-bold text-gray-800">Support & Legal</Text>
      <View className="overflow-hidden bg-white rounded-2xl border shadow-lg border-gray-100/50 shadow-gray-200/50">
        <ProfileRow
          icon="mail-outline"
          title="Contact Support"
          subtitle="Get help with your account or app"
          onPress={handleContactSupport}
          showBorder={true}
        />

        {/* <ProfileRow
          icon="help-circle-outline"
          title="FAQ"
          subtitle="Frequently asked questions"
          onPress={handleFAQ}
          showBorder={true}
        /> */}

        <ProfileRow
          icon="shield-checkmark-outline"
          title="Privacy Policy"
          subtitle="How we protect your data"
          onPress={handlePrivacyPolicy}
          showBorder={true}
        />

        <ProfileRow
          icon="document-text-outline"
          title="Terms of Service"
          subtitle="App usage terms and conditions"
          onPress={handleTermsOfService}
          showBorder={false}
        />
      </View>

      <SupportModal
        visible={isSupportModalVisible}
        onClose={() => setIsSupportModalVisible(false)}
      />
    </View>
  );
}
