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
      NSCameraUsageDescription: 'This app uses the camera to take photos of plants.',
      NSPhotoLibraryUsageDescription: 'This app accesses your photos to let you share them.',
    },
    bundleIdentifier: 'com.enes.plant-app',
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#FFFFFF',
    },
    permissions: ['NOTIFICATIONS', 'CAMERA', 'READ_EXTERNAL_STORAGE', 'WRITE_EXTERNAL_STORAGE'],
    package: 'com.enes.plantapp',
  },
  web: {
    favicon: './assets/favicon.png',
  },
  extra: {
    // Environment variables
    apiUrl: process.env.API_URL || 'https://api.yourapp.com',
    // Add other environment variables here
    eas: {
      projectId: 'ed073822-5b73-4222-b31b-14b7ab3ad3f7',
    },
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
        icon: './assets/icon.png',
        color: '#ffffff',
      },
    ],
  ],
});
