import axios, { AxiosInstance } from 'axios';
import Constants from 'expo-constants';

// Get base URL from environment variables
const getBaseURL = (): string => {
  const apiUrl = Constants.expoConfig?.extra?.apiUrl;
  if (apiUrl) {
    return apiUrl;
  }

  // Fallback URLs based on environment
  if (__DEV__) {
    return 'http://localhost:3000/api';
  }

  return 'https://api.yourapp.com'; // Replace with your production API URL
};

// Create axios instance with default config
const customRequest: AxiosInstance = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default customRequest;
