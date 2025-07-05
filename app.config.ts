import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Expo Example App',
  slug: 'expo-example-app',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    infoPlist: {
      UIBackgroundModes: ['remote-notification'],
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#FFFFFF',
    },
    permissions: ['NOTIFICATIONS'],
  },
  web: {
    favicon: './assets/favicon.png',
  },
  extra: {
    // Environment variables
    apiUrl: process.env.API_URL || 'https://api.yourapp.com',
    // Add other environment variables here
  },
  plugins: [
    [
      'expo-router',
      {
        root: 'src/app',
      },
    ],
    [
      'expo-image-picker',
      {
        photosPermission: 'The app accesses your photos to let you share them with your friends.',
        cameraPermission: 'The app accesses your camera to let you take photos of your plants.',
      },
    ],
    [
      'expo-notifications',
      {
        icon: './assets/notification-icon.png',
        color: '#ffffff',
        sounds: ['./assets/notification-sound.wav'],
      },
    ],
  ],
});
