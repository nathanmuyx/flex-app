import { StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';
import FlexLogo from '@/assets/images/flex-logo.svg';

export function FeedHeader() {
  const insets = useSafeAreaInsets();
  const iconColor = useThemeColor({}, 'icon');
  const borderColor = useThemeColor({}, 'separator');

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top, borderBottomColor: borderColor }]}>
      <FlexLogo width={120} height={48} />
      <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/activity')}>
        <IconSymbol name="bell.fill" size={26} color={iconColor} weight="regular" />
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: 0.5,
  },
  actionButton: {
    padding: 4,
  },
});
