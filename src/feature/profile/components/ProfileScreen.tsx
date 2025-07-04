import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '../../../context/AuthContext';
import { ProfileHeader } from './ProfileHeader';
import { ProfileSection } from './ProfileSection';
import { UpdateProfileModal } from './UpdateProfileModal';
import { ChangePasswordModal } from './ChangePasswordModal';
import { SupportSection } from './SupportSection';
import { useProfile } from '../hooks/useProfile';

export function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { updateProfile, changePassword, deleteAccount, isLoading } = useProfile();
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/auth/login');
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAccount();
              Alert.alert('Account Deleted', 'Your account has been successfully deleted.');
              router.replace('/auth/login');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete account. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleProfileUpdate = async (profileData: {
    name: string;
    surname: string;
    profilePhoto?: string;
  }) => {
    try {
      await updateProfile(profileData);
      setIsUpdateModalVisible(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    }
  };

  const handlePasswordChange = async (passwordData: {
    currentPassword: string;
    newPassword: string;
  }) => {
    try {
      await changePassword(passwordData);
      setIsPasswordModalVisible(false);
      Alert.alert('Success', 'Password changed successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to change password. Please try again.');
    }
  };

  return (
    <>
      <ScrollView className="flex-1 px-4 py-4">
        {/* Profile Header */}
        <ProfileHeader user={user} />

        {/* Profile Management */}
        <ProfileSection
          title="Account Settings"
          items={[
            {
              title: 'Edit Profile',
              subtitle: 'Update your name, surname, and profile photo',
              icon: '👤',
              onPress: () => setIsUpdateModalVisible(true),
            },
            {
              title: 'Change Password',
              subtitle: 'Update your account password',
              icon: '🔒',
              onPress: () => setIsPasswordModalVisible(true),
            },
          ]}
        />

        {/* Support */}
        <SupportSection />

        {/* Account Actions */}
        <ProfileSection
          title="Account Actions"
          items={[
            {
              title: 'Logout',
              subtitle: 'Sign out of your account',
              icon: '🚪',
              onPress: handleLogout,
              destructive: true,
            },
            {
              title: 'Delete Account',
              subtitle: 'Permanently delete your account and all data',
              icon: '🗑️',
              onPress: handleDeleteAccount,
              destructive: true,
            },
          ]}
        />

        <View className="h-20" />
      </ScrollView>

      <UpdateProfileModal
        visible={isUpdateModalVisible}
        onClose={() => setIsUpdateModalVisible(false)}
        onUpdate={handleProfileUpdate}
        user={user}
        isLoading={isLoading}
      />

      <ChangePasswordModal
        visible={isPasswordModalVisible}
        onClose={() => setIsPasswordModalVisible(false)}
        onChangePassword={handlePasswordChange}
        isLoading={isLoading}
      />
    </>
  );
}
