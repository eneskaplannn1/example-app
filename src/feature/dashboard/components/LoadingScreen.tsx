import { View, ActivityIndicator } from 'react-native';

export function LoadingScreen() {
  return (
    <View className="flex-1 justify-center items-center w-screen h-screen">
      <ActivityIndicator size={'large'} />
    </View>
  );
}
