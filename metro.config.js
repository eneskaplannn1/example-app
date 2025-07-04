// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Configure resolver to support src/app structure
config.resolver.alias = {
  ...config.resolver.alias,
  // Map app routes to src/app
  app: path.resolve(__dirname, 'src/app'),
};

module.exports = withNativeWind(config, { input: './global.css' });
