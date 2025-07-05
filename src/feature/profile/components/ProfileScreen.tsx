import { useState } from 'react';
import { View, ScrollView, Alert, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../../context/AuthContext';
import { ProfileSection } from './ProfileSection';
import { UpdateProfileModal } from './UpdateProfileModal';
import { ChangePasswordModal } from './ChangePasswordModal';
import { SupportSection } from './SupportSection';
import { useProfile } from '../hooks/useProfile';

export function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { updateProfile, changePassword, isLoading } = useProfile();
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
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}>
        <View className="px-6 space-y-6">
          <ProfileSection
            title="Account Settings"
            items={[
              {
                title: 'Edit Profile',
                subtitle: 'Update your name, surname, and profile photo',
                icon: 'person-outline',
                onPress: () => setIsUpdateModalVisible(true),
              },
              {
                title: 'Change Password',
                subtitle: 'Update your account password',
                icon: 'lock-closed-outline',
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
                icon: 'log-out-outline',
                onPress: handleLogout,
                destructive: true,
              },
              // {
              //   title: 'Delete Account',
              //   subtitle: 'Permanently delete your account and all data',
              //   icon: 'trash-outline',
              //   onPress: handleDeleteAccount,
              //   destructive: true,
              // },
            ]}
          />
        </View>
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
    </View>
  );
}
