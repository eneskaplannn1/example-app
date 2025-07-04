import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'expo-router';

interface SignupFormInputs {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
}

export default function Signup() {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<SignupFormInputs>({
    mode: 'onChange',
  });
  const { signup, isLoading, error } = useAuth();
  const router = useRouter();
  const password = watch('password');

  const onSubmit = async (data: SignupFormInputs) => {
    try {
      await signup(data.email, data.password);
    } catch (err) {
      Alert.alert('Signup Failed', 'Please check your information and try again.');
    }
  };

  const navigateToLogin = () => {
    router.push('/auth/login');
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1">
        <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
          <View className="flex-1 justify-center px-6">
            {/* Header */}
            <View className="mb-8">
              <Text className="mb-2 text-3xl font-bold text-gray-800">Create Account</Text>
              <Text className="text-gray-600">Join us and start your plant care journey</Text>
            </View>

            {/* Form */}
            <View className="space-y-4">
              <View>
                <Text className="mb-2 text-sm font-medium text-gray-700">Full Name</Text>
                <Controller
                  control={control}
                  name="name"
                  rules={{
                    required: 'Name is required',
                    minLength: {
                      value: 2,
                      message: 'Name must be at least 2 characters',
                    },
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      className={`w-full rounded-lg border px-4 py-3 ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      } bg-white`}
                      placeholder="Enter your full name"
                      autoCapitalize="words"
                      autoComplete="name"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                />
                {errors.name && (
                  <Text className="mt-1 text-sm text-red-500">{errors.name.message}</Text>
                )}
              </View>

              <View>
                <Text className="mb-2 text-sm font-medium text-gray-700">Email</Text>
                <Controller
                  control={control}
                  name="email"
                  rules={{
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      className={`w-full rounded-lg border px-4 py-3 ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      } bg-white`}
                      placeholder="Enter your email"
                      autoCapitalize="none"
                      keyboardType="email-address"
                      autoComplete="email"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                />
                {errors.email && (
                  <Text className="mt-1 text-sm text-red-500">{errors.email.message}</Text>
                )}
              </View>

              <View>
                <Text className="mb-2 text-sm font-medium text-gray-700">Password</Text>
                <Controller
                  control={control}
                  name="password"
                  rules={{
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      className={`w-full rounded-lg border px-4 py-3 ${
                        errors.password ? 'border-red-500' : 'border-gray-300'
                      } bg-white`}
                      placeholder="Create a password"
                      secureTextEntry
                      autoComplete="new-password"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                />
                {errors.password && (
                  <Text className="mt-1 text-sm text-red-500">{errors.password.message}</Text>
                )}
              </View>

              <View>
                <Text className="mb-2 text-sm font-medium text-gray-700">Confirm Password</Text>
                <Controller
                  control={control}
                  name="confirmPassword"
                  rules={{
                    required: 'Please confirm your password',
                    validate: (value) => value === password || 'Passwords do not match',
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      className={`w-full rounded-lg border px-4 py-3 ${
                        errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                      } bg-white`}
                      placeholder="Confirm your password"
                      secureTextEntry
                      autoComplete="new-password"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                />
                {errors.confirmPassword && (
                  <Text className="mt-1 text-sm text-red-500">
                    {errors.confirmPassword.message}
                  </Text>
                )}
              </View>

              {error && (
                <View className="p-3 bg-red-50 rounded-lg border border-red-200">
                  <Text className="text-sm text-red-600">{error}</Text>
                </View>
              )}

              <TouchableOpacity
                className={`w-full rounded-lg py-3 ${
                  isValid && !isLoading ? 'bg-green-500' : 'bg-gray-300'
                }`}
                onPress={handleSubmit(onSubmit)}
                disabled={!isValid || isLoading}>
                <Text className="text-lg font-semibold text-center text-white">
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Login Link */}
            <View className="flex-row justify-center mt-6">
              <Text className="text-gray-600">Already have an account? </Text>
              <TouchableOpacity onPress={navigateToLogin}>
                <Text className="font-semibold text-green-600">Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
