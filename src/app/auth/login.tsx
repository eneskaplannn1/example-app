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
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface LoginFormInputs {
  email: string;
  password: string;
}

export default function Login() {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormInputs>({
    mode: 'onChange',
  });
  const { login, isLoading, error } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      await login(data.email, data.password);
    } catch (err) {
      Alert.alert('Login Failed', 'Please check your credentials and try again.');
    }
  };

  const navigateToSignup = () => {
    router.push('/auth/signup');
  };

  return (
    <View className="flex-1 bg-slate-50">
      <SafeAreaView className="flex-1">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1">
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}>
            {/* Header Section */}
            <View className="px-6 pb-12 pt-8">
              <View className="items-center">
                <View className="mb-6 h-20 w-20 items-center justify-center rounded-3xl bg-emerald-500 shadow-lg">
                  <Ionicons name="leaf" size={36} color="white" />
                </View>
                <Text className="mb-2 text-3xl font-bold text-slate-800">Welcome Back</Text>
                <Text className="text-center text-base text-slate-600">
                  Sign in to continue your plant care journey
                </Text>
              </View>
            </View>

            {/* Form Section */}
            <View className="flex-1 px-6">
              <View className="space-y-6">
                {/* Email Field */}
                <View>
                  <Text className="mb-2 text-sm font-semibold text-slate-700">Email Address</Text>
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
                      <View className="relative">
                        <TextInput
                          className={`w-full rounded-2xl border-2 px-5 py-4 text-base ${
                            errors.email ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-white'
                          } text-slate-800 placeholder-slate-400`}
                          placeholder="Enter your email"
                          placeholderTextColor="#94a3b8"
                          autoCapitalize="none"
                          keyboardType="email-address"
                          autoComplete="email"
                          onBlur={onBlur}
                          onChangeText={onChange}
                          value={value}
                        />
                        <View className="absolute right-4 top-4">
                          <Ionicons
                            name="mail-outline"
                            size={20}
                            color={errors.email ? '#ef4444' : '#94a3b8'}
                          />
                        </View>
                      </View>
                    )}
                  />
                  {errors.email && (
                    <Text className="mt-2 text-sm text-red-500">{errors.email.message}</Text>
                  )}
                </View>

                {/* Password Field */}
                <View>
                  <Text className="mb-2 text-sm font-semibold text-slate-700">Password</Text>
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
                      <View className="relative">
                        <TextInput
                          className={`w-full rounded-2xl border-2 px-5 py-4 text-base ${
                            errors.password
                              ? 'border-red-300 bg-red-50'
                              : 'border-slate-200 bg-white'
                          } pr-12 text-slate-800 placeholder-slate-400`}
                          placeholder="Enter your password"
                          placeholderTextColor="#94a3b8"
                          secureTextEntry={!showPassword}
                          autoComplete="password"
                          onBlur={onBlur}
                          onChangeText={onChange}
                          value={value}
                        />
                        <TouchableOpacity
                          onPress={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-4">
                          <Ionicons
                            name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                            size={20}
                            color={errors.password ? '#ef4444' : '#94a3b8'}
                          />
                        </TouchableOpacity>
                      </View>
                    )}
                  />
                  {errors.password && (
                    <Text className="mt-2 text-sm text-red-500">{errors.password.message}</Text>
                  )}
                </View>

                {/* Error Message */}
                {error && (
                  <View className="rounded-2xl border border-red-200 bg-red-50 p-4">
                    <View className="flex-row items-center">
                      <Ionicons name="alert-circle-outline" size={20} color="#ef4444" />
                      <Text className="ml-3 flex-1 text-sm text-red-600">{error}</Text>
                    </View>
                  </View>
                )}

                {/* Sign In Button */}
                <TouchableOpacity
                  className={`mt-6 w-full rounded-2xl py-4 ${
                    isValid && !isLoading ? 'bg-emerald-500' : 'bg-slate-300'
                  } shadow-sm`}
                  onPress={handleSubmit(onSubmit)}
                  disabled={!isValid || isLoading}
                  style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 3,
                  }}>
                  <View className="flex-row items-center justify-center">
                    {isLoading ? (
                      <View className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      <Ionicons name="arrow-forward" size={20} color="white" />
                    )}
                    <Text className="ml-2 text-lg font-semibold text-white">
                      {isLoading ? 'Signing In...' : 'Sign In'}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>

              {/* Divider */}
              <View className="my-8 flex-row items-center">
                <View className="h-px flex-1 bg-slate-200" />
                <Text className="mx-4 text-sm text-slate-500">or</Text>
                <View className="h-px flex-1 bg-slate-200" />
              </View>

              {/* Sign Up Link */}
              <View className="items-center">
                <Text className="mb-4 text-base text-slate-600">Don&apos;t have an account?</Text>
                <TouchableOpacity
                  onPress={navigateToSignup}
                  className="rounded-2xl border-2 border-emerald-500 bg-white px-8 py-3">
                  <Text className="text-base font-semibold text-emerald-500">Create Account</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Footer */}
            <View className="px-6 pb-8">
              <Text className="text-center text-xs text-slate-500">
                By signing in, you agree to our Terms of Service and Privacy Policy
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
