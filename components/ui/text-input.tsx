import { StyleSheet, TextInput as RNTextInput, type TextInputProps } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedTextInputProps = TextInputProps & {
  lightColor?: string;
  darkColor?: string;
  hasError?: boolean;
};

export function TextInput({
  style,
  lightColor,
  darkColor,
  hasError,
  ...rest
}: ThemedTextInputProps) {
  const textColor = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const backgroundColor = useThemeColor({}, 'inputBackground');
  const borderColor = useThemeColor({}, hasError ? 'error' : 'inputBorder');
  const placeholderColor = useThemeColor({}, 'inputPlaceholder');

  return (
    <RNTextInput
      style={[
        styles.input,
        {
          color: textColor,
          backgroundColor,
          borderColor,
        },
        style,
      ]}
      placeholderTextColor={placeholderColor}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
});
