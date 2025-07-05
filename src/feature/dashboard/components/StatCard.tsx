import { Text, TouchableOpacity } from 'react-native';
import { showToast } from '~/src/components';

interface StatCardProps {
  title: string;
  value: number;
  color: string;
}

export function StatCard({ title, value, color }: StatCardProps) {
  return (
    <TouchableOpacity
      onPress={() => {
        showToast.success('Success', 'This is a success toast');
      }}
      className={`flex-1 p-4 mx-1 rounded-lg ${color}`}>
      <Text className="text-lg font-bold text-white">{value}</Text>
      <Text className="text-sm text-white opacity-90">{title}</Text>
    </TouchableOpacity>
  );
}
