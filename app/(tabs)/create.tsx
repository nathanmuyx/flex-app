import { useCallback } from 'react';
import { StyleSheet, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function CreateScreen() {
  const tintColor = useThemeColor({}, 'tint');

  // Navigate to select-photos modal when this tab is focused
  useFocusEffect(
    useCallback(() => {
      // Small delay to ensure smooth transition
      const timer = setTimeout(() => {
        router.push('/(modals)/select-photos');
      }, 100);

      return () => clearTimeout(timer);
    }, [])
  );

  // Show loading state while redirecting
  return (
    <ThemedView style={styles.container}>
      <ActivityIndicator size="large" color={tintColor} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
