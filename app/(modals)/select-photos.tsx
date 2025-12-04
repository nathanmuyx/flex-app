import { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedView } from '@/components/themed-view';
import { getPreviousTab } from '@/utils/navigation-state';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { ContentTypeTabs, type ContentType } from '@/components/create/content-type-tabs';
import { PhotoGrid, type PhotoAsset } from '@/components/create/photo-grid';
import { BrandColors } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';

// Mock photo data for UI development
const MOCK_PHOTOS: PhotoAsset[] = Array.from({ length: 20 }, (_, i) => ({
  id: `photo-${i}`,
  uri: `https://picsum.photos/seed/${i + 1}/400/400`,
}));

export default function SelectPhotosModal() {
  const insets = useSafeAreaInsets();
  const textColor = useThemeColor({}, 'text');

  const [activeTab, setActiveTab] = useState<ContentType>('post');
  const [photos] = useState(MOCK_PHOTOS);
  const [selectedIds, setSelectedIds] = useState<string[]>([MOCK_PHOTOS[0].id]);

  // Get the first selected photo for preview
  const previewPhoto = photos.find((p) => p.id === selectedIds[0]);

  function handleTabChange(tab: ContentType) {
    setActiveTab(tab);
    // Clear selection when switching tabs (story is single-select)
    if (tab === 'story' && selectedIds.length > 1) {
      setSelectedIds(selectedIds.slice(0, 1));
    }
  }

  function handlePhotoSelect(asset: PhotoAsset) {
    if (activeTab === 'story') {
      // Single select for story
      setSelectedIds([asset.id]);
    } else {
      // Multi-select for post
      if (selectedIds.includes(asset.id)) {
        // Deselect - but keep at least one selected
        if (selectedIds.length > 1) {
          setSelectedIds(selectedIds.filter((id) => id !== asset.id));
        }
      } else {
        setSelectedIds([...selectedIds, asset.id]);
      }
    }
  }

  function handleCameraPress() {
    // No-op for now - camera functionality disabled
  }

  function handleNext() {
    const selectedPhotos = photos.filter((p) => selectedIds.includes(p.id));
    const selectedUris = selectedPhotos.map((p) => p.uri);

    if (activeTab === 'post') {
      router.push({
        pathname: '/(modals)/post-options',
        params: { photos: JSON.stringify(selectedUris) },
      });
    } else {
      router.push({
        pathname: '/(modals)/create-story',
        params: { photo: selectedUris[0] },
      });
    }
  }

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace(getPreviousTab())} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={24} color={textColor} weight="regular" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: textColor }]}>Select Photos</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <ContentTypeTabs activeTab={activeTab} onTabChange={handleTabChange} />
      </View>

      {/* Preview Image */}
      <View style={styles.previewContainer}>
        {previewPhoto ? (
          <Image
            source={{ uri: previewPhoto.uri }}
            style={styles.previewImage}
            contentFit="cover"
          />
        ) : (
          <View style={[styles.previewPlaceholder, { backgroundColor: BrandColors.gray[200] }]}>
            <IconSymbol name="photo" size={48} color={BrandColors.gray[400]} />
          </View>
        )}
      </View>

      {/* Info Bar */}
      <View style={styles.infoBar}>
        <Text style={styles.infoText}>
          {activeTab === 'post' ? 'Tap photos to select multiple' : 'Select a photo for your story'}
        </Text>
        <View style={styles.selectedBadge}>
          <Text style={styles.badgeText}>Selected</Text>
          <Text style={styles.badgeCount}>{selectedIds.length}</Text>
        </View>
      </View>

      {/* Photo Grid */}
      <PhotoGrid
        photos={photos}
        selectedIds={selectedIds}
        onSelect={handlePhotoSelect}
        onCameraPress={handleCameraPress}
        multiSelect={activeTab === 'post'}
      />

      {/* Bottom Action Bar */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 16 }]}>
        <TouchableOpacity
          style={[styles.nextButton, selectedIds.length === 0 && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={selectedIds.length === 0}
          activeOpacity={0.8}
        >
          <Text style={styles.nextButtonText}>Next</Text>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 13,
    paddingVertical: 16,
    backgroundColor: BrandColors.base.white,
  },
  backButton: {
    width: 24,
    height: 24,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  headerSpacer: {
    width: 24,
  },
  tabsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: BrandColors.base.white,
  },
  previewContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: BrandColors.base.white,
  },
  previewImage: {
    width: '100%',
    aspectRatio: 339 / 265,
    borderRadius: 12,
  },
  previewPlaceholder: {
    width: '100%',
    aspectRatio: 339 / 265,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: BrandColors.gray[50],
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: BrandColors.gray[200],
  },
  infoText: {
    fontSize: 12,
    fontWeight: '500',
    color: BrandColors.gray[500],
  },
  selectedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: BrandColors.gray[200],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: BrandColors.gray[500],
  },
  badgeCount: {
    fontSize: 12,
    fontWeight: '500',
    color: BrandColors.gray[500],
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
  nextButton: {
    backgroundColor: BrandColors.orange[500],
    borderRadius: 20,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonDisabled: {
    opacity: 0.5,
  },
  nextButtonText: {
    color: BrandColors.base.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
