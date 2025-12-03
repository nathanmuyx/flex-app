import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { getPreviousTab } from '@/utils/navigation-state';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';
import { BrandColors } from '@/constants/theme';

export default function CreateStoryModal() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ photo?: string }>();
  const photoUri = params.photo || null;

  const tintColor = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'inputBorder');

  function handleShare() {
    // TODO: Implement story creation with Xano
    console.log('Creating story:', { photo: photoUri });
    // Go back to the previous tab
    router.replace(getPreviousTab());
  }

  function handleBack() {
    router.replace(getPreviousTab());
  }

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={24} color={textColor} />
        </TouchableOpacity>
        <ThemedText type="defaultSemiBold">New Story</ThemedText>
        <TouchableOpacity onPress={handleShare}>
          <ThemedText style={{ color: tintColor, fontWeight: '600' }}>Share</ThemedText>
        </TouchableOpacity>
      </View>

      {/* Story Preview */}
      <View style={styles.previewContainer}>
        {photoUri ? (
          <Image
            source={{ uri: photoUri }}
            style={styles.storyPreview}
            contentFit="cover"
          />
        ) : (
          <View style={[styles.storyPlaceholder, { borderColor }]}>
            <ThemedText style={styles.placeholderText}>No photo selected</ThemedText>
          </View>
        )}
      </View>

      {/* Bottom Action */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity
          style={[styles.shareButton, !photoUri && styles.shareButtonDisabled]}
          onPress={handleShare}
          disabled={!photoUri}
          activeOpacity={0.8}
        >
          <ThemedText style={styles.shareButtonText}>Share Story</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 24,
    height: 24,
  },
  previewContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  storyPreview: {
    flex: 1,
    borderRadius: 12,
  },
  storyPlaceholder: {
    flex: 1,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    opacity: 0.5,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: BrandColors.base.white,
    paddingHorizontal: 24,
    paddingTop: 16,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 14,
    elevation: 10,
  },
  shareButton: {
    backgroundColor: BrandColors.orange[500],
    borderRadius: 20,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareButtonDisabled: {
    opacity: 0.5,
  },
  shareButtonText: {
    color: BrandColors.base.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
