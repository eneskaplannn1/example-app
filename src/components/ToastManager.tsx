import Toast from 'react-native-toast-message';
import { CustomToast } from './Toast';

export function ToastManager() {
  const toastConfig = {
    success: (props: any) => (
      <CustomToast
        type="success"
        text1={props.text1}
        text2={props.text2}
        onPress={props.onPress}
        position="top"
        visibilityTime={2500}
      />
    ),
    error: (props: any) => (
      <CustomToast
        type="error"
        text1={props.text1}
        text2={props.text2}
        onPress={props.onPress}
        position="top"
        visibilityTime={2500}
      />
    ),
    warning: (props: any) => (
      <CustomToast
        type="warning"
        text1={props.text1}
        text2={props.text2}
        onPress={props.onPress}
        position="top"
        visibilityTime={2500}
      />
    ),
    info: (props: any) => (
      <CustomToast
        type="info"
        text1={props.text1}
        text2={props.text2}
        onPress={props.onPress}
        position="top"
        visibilityTime={2500}
      />
    ),
  };

  return <Toast config={toastConfig} />;
}

// Toast utility functions for easy usage
export const showToast = {
  success: (title: string, message?: string) => {
    Toast.show({
      type: 'success',
      text1: title,
      text2: message,
    });
  },
  error: (title: string, message?: string) => {
    Toast.show({
      type: 'error',
      text1: title,
      text2: message,
    });
  },
  warning: (title: string, message?: string) => {
    Toast.show({
      type: 'warning',
      text1: title,
      text2: message,
    });
  },
  info: (title: string, message?: string) => {
    Toast.show({
      type: 'info',
      text1: title,
      text2: message,
    });
  },
  hide: () => {
    Toast.hide();
  },
};
