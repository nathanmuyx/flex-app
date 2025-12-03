import { useState } from 'react';
import { StyleSheet, TouchableOpacity, TextInput as RNTextInput, View, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { getPreviousTab } from '@/utils/navigation-state';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';
import { BrandColors } from '@/constants/theme';

export default function CreatePostModal() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ photos?: string }>();
  const photoUris: string[] = params.photos ? JSON.parse(params.photos) : [];

  const [caption, setCaption] = useState('');
  const tintColor = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');
  const inputBg = useThemeColor({}, 'inputBackground');
  const borderColor = useThemeColor({}, 'inputBorder');
  const placeholderColor = useThemeColor({}, 'inputPlaceholder');

  function handlePost() {
    // TODO: Implement post creation with Xano
    console.log('Creating post:', { photos: photoUris, caption });
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
        <ThemedText type="defaultSemiBold">New Post</ThemedText>
        <TouchableOpacity onPress={handlePost}>
          <ThemedText style={{ color: tintColor, fontWeight: '600' }}>Share</ThemedText>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Image Preview */}
        {photoUris.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.imageScroll}
            contentContainerStyle={styles.imageScrollContent}
          >
            {photoUris.map((uri, index) => (
              <Image
                key={index}
                source={{ uri }}
                style={styles.previewImage}
                contentFit="cover"
              />
            ))}
          </ScrollView>
        ) : (
          <View style={[styles.imagePlaceholder, { borderColor }]}>
            <ThemedText style={styles.placeholderText}>No photos selected</ThemedText>
          </View>
        )}

        {/* Caption Input */}
        <RNTextInput
          style={[
            styles.captionInput,
            {
              color: textColor,
              backgroundColor: inputBg,
              borderColor,
            },
          ]}
          placeholder="Write a caption..."
          placeholderTextColor={placeholderColor}
          value={caption}
          onChangeText={setCaption}
          multiline
        />
      </ScrollView>

      {/* Bottom Action */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity
          style={[styles.shareButton, photoUris.length === 0 && styles.shareButtonDisabled]}
          onPress={handlePost}
          disabled={photoUris.length === 0}
          activeOpacity={0.8}
        >
          <ThemedText style={styles.shareButtonText}>Share Post</ThemedText>
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
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  imageScroll: {
    marginBottom: 16,
  },
  imageScrollContent: {
    gap: 8,
  },
  previewImage: {
    width: 300,
    height: 300,
    borderRadius: 12,
  },
  imagePlaceholder: {
    aspectRatio: 1,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  placeholderText: {
    opacity: 0.5,
  },
  captionInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    minHeight: 100,
    textAlignVertical: 'top',
    fontSize: 16,
    marginBottom: 120,
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
