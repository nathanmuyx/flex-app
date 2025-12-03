import { StyleSheet, TouchableOpacity, View, FlatList, Dimensions } from 'react-native';
import { Image } from 'expo-image';

import { IconSymbol } from '@/components/ui/icon-symbol';
import { BrandColors } from '@/constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GAP = 2;
const NUM_COLUMNS = 3;
const TILE_SIZE = (SCREEN_WIDTH - (GAP * (NUM_COLUMNS - 1))) / NUM_COLUMNS;

// Simple photo type for mock data
export type PhotoAsset = { id: string; uri: string; mediaType?: string };

interface PhotoGridProps {
  photos: PhotoAsset[];
  selectedIds: string[];
  onSelect: (asset: PhotoAsset) => void;
  onCameraPress: () => void;
  multiSelect: boolean;
}

interface CameraTileProps {
  onPress: () => void;
}

function CameraTile({ onPress }: CameraTileProps) {
  return (
    <TouchableOpacity style={styles.cameraTile} onPress={onPress} activeOpacity={0.7}>
      <IconSymbol name="camera" size={32} color={BrandColors.base.white} weight="regular" />
    </TouchableOpacity>
  );
}

interface PhotoTileProps {
  asset: PhotoAsset;
  isSelected: boolean;
  selectionIndex?: number;
  onPress: () => void;
  multiSelect: boolean;
}

function PhotoTile({ asset, isSelected, selectionIndex, onPress, multiSelect }: PhotoTileProps) {
  const isVideo = asset.mediaType === 'video';

  return (
    <TouchableOpacity style={styles.photoTile} onPress={onPress} activeOpacity={0.8}>
      <Image
        source={{ uri: asset.uri }}
        style={styles.photo}
        contentFit="cover"
      />
      {isVideo && (
        <View style={styles.videoIndicator}>
          <IconSymbol name="play" size={20} color={BrandColors.base.white} weight="fill" />
        </View>
      )}
      {isSelected && (
        <View style={styles.selectionOverlay}>
          <View style={styles.checkCircle}>
            {multiSelect && selectionIndex !== undefined ? (
              <View style={styles.selectionNumber}>
                <IconSymbol name="check-circle" size={24} color={BrandColors.orange[500]} weight="fill" />
              </View>
            ) : (
              <IconSymbol name="check-circle" size={24} color={BrandColors.orange[500]} weight="fill" />
            )}
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}

export function PhotoGrid({ photos, selectedIds, onSelect, onCameraPress, multiSelect }: PhotoGridProps) {
  const renderItem = ({ item }: { item: PhotoAsset | 'camera' }) => {
    if (item === 'camera') {
      return <CameraTile onPress={onCameraPress} />;
    }

    const isSelected = selectedIds.includes(item.id);
    const selectionIndex = selectedIds.indexOf(item.id);

    return (
      <PhotoTile
        asset={item}
        isSelected={isSelected}
        selectionIndex={selectionIndex >= 0 ? selectionIndex + 1 : undefined}
        onPress={() => onSelect(item)}
        multiSelect={multiSelect}
      />
    );
  };

  // Add camera as first item
  const data: (PhotoAsset | 'camera')[] = ['camera', ...photos];

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => (item === 'camera' ? 'camera' : item.id)}
      numColumns={NUM_COLUMNS}
      columnWrapperStyle={styles.row}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.gridContent}
    />
  );
}

const styles = StyleSheet.create({
  gridContent: {
    paddingBottom: 120,
  },
  row: {
    gap: GAP,
    marginBottom: GAP,
  },
  cameraTile: {
    width: TILE_SIZE,
    height: TILE_SIZE,
    backgroundColor: BrandColors.gray[400],
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoTile: {
    width: TILE_SIZE,
    height: TILE_SIZE,
    backgroundColor: BrandColors.gray[200],
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  videoIndicator: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
    padding: 4,
  },
  selectionOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  checkCircle: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  selectionNumber: {
    backgroundColor: BrandColors.base.white,
    borderRadius: 12,
  },
});
