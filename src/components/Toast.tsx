import React, { useEffect, useRef } from 'react';
import { View, Text, Pressable, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width: screenWidth } = Dimensions.get('window');

interface ToastProps {
  type?: 'success' | 'error' | 'warning' | 'info';
  text1?: string;
  text2?: string;
  onPress?: () => void;
  onHide?: () => void;
  position?: 'top' | 'bottom';
  visibilityTime?: number;
}

interface ToastConfig {
  backgroundColor: string[];
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
}

const toastConfigs: Record<string, ToastConfig> = {
  success: {
    backgroundColor: ['#4ade80', '#22c55e'],
    icon: 'checkmark-circle',
    iconColor: '#ffffff',
  },
  error: {
    backgroundColor: ['#f87171', '#ef4444'],
    icon: 'close-circle',
    iconColor: '#ffffff',
  },
  warning: {
    backgroundColor: ['#fbbf24', '#f59e0b'],
    icon: 'warning',
    iconColor: '#ffffff',
  },
  info: {
    backgroundColor: ['#60a5fa', '#3b82f6'],
    icon: 'information-circle',
    iconColor: '#ffffff',
  },
};

export function CustomToast({
  type = 'info',
  text1,
  text2,
  onPress,
  onHide,
  position = 'top',
  visibilityTime = 4000,
}: ToastProps) {
  const translateY = useSharedValue(position === 'top' ? -100 : 100);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);
  const progress = useSharedValue(0);
  const shake = useSharedValue(0);

  const config = toastConfigs[type];
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Entrance animation
    translateY.value = withSpring(0, {
      damping: 15,
      stiffness: 150,
    });
    opacity.value = withTiming(1, { duration: 300 });
    scale.value = withSpring(1, {
      damping: 15,
      stiffness: 150,
    });

    // Progress bar animation
    progress.value = withTiming(1, { duration: visibilityTime });

    // Auto hide
    timeoutRef.current = setTimeout(() => {
      hideToast();
    }, visibilityTime);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [visibilityTime, position]);

  const hideToast = () => {
    translateY.value = withSpring(position === 'top' ? -100 : 100, {
      damping: 15,
      stiffness: 150,
    });
    opacity.value = withTiming(0, { duration: 300 });
    scale.value = withSpring(
      0.8,
      {
        damping: 15,
        stiffness: 150,
      },
      () => {
        if (onHide) {
          runOnJS(onHide)();
        }
      }
    );
  };

  const handlePress = () => {
    if (onPress) {
      onPress();
    }
    hideToast();
  };

  const handleLongPress = () => {
    // Shake animation on long press
    shake.value = withTiming(1, { duration: 100 }, () => {
      shake.value = withTiming(0, { duration: 100 });
    });
  };

  const animatedStyle = useAnimatedStyle(() => {
    const shakeOffset = interpolate(shake.value, [0, 1], [0, 10], Extrapolate.CLAMP);

    return {
      transform: [
        { translateY: translateY.value },
        { scale: scale.value },
        { translateX: shakeOffset },
      ],
      opacity: opacity.value,
    };
  });

  const progressStyle = useAnimatedStyle(() => {
    return {
      width: `${progress.value * 100}%`,
    };
  });

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: 16,
          right: 16,
          zIndex: 9999,
          ...(position === 'top' ? { top: 50 } : { bottom: 50 }),
        },
        animatedStyle,
      ]}>
      <Pressable onPress={handlePress} onLongPress={handleLongPress} style={{ width: '100%' }}>
        <LinearGradient
          colors={config.backgroundColor as [string, string]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            borderRadius: 16,
            padding: 16,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 12,
              }}>
              <Ionicons name={config.icon} size={24} color={config.iconColor} />
            </View>

            <View style={{ flex: 1 }}>
              {text1 && (
                <Text
                  style={{
                    color: '#ffffff',
                    fontSize: 16,
                    fontWeight: '600',
                    marginBottom: text2 ? 4 : 0,
                  }}>
                  {text1}
                </Text>
              )}
              {text2 && (
                <Text
                  style={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: 14,
                    fontWeight: '400',
                  }}>
                  {text2}
                </Text>
              )}
            </View>

            <Pressable
              onPress={hideToast}
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                justifyContent: 'center',
                alignItems: 'center',
                marginLeft: 8,
              }}>
              <Ionicons name="close" size={20} color="#ffffff" />
            </Pressable>
          </View>

          {/* Progress bar */}
          <Animated.View
            style={[
              {
                height: 3,
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                borderRadius: 2,
                marginTop: 12,
                overflow: 'hidden',
              },
              progressStyle,
            ]}>
            <View
              style={{
                height: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                borderRadius: 2,
              }}
            />
          </Animated.View>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}
