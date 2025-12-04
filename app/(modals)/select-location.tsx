import { useState, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { BrandColors } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';

interface Location {
  id: string;
  name: string;
  subtitle: string;
}

// Mock locations data
const MOCK_LOCATIONS: Location[] = [
  { id: '1', name: '505 N Lake Shore Dr', subtitle: 'Chicago, IL 60611, USA' },
  { id: '2', name: '505 N Lake Shore Dr, Unit 2501', subtitle: 'Chicago, IL 60611, USA' },
  { id: '3', name: 'Lake Shore Plaza', subtitle: '505 N Lake Shore Dr, Chicago, IL' },
  { id: '4', name: 'Lake Shore Drive & Ohio Street', subtitle: 'Near Streeterville, Chicago, IL' },
];

interface LocationRowProps {
  location: Location;
  isSelected: boolean;
  onSelect: () => void;
  textColor: string;
  secondaryTextColor: string;
}

function LocationRow({
  location,
  isSelected,
  onSelect,
  textColor,
  secondaryTextColor,
}: LocationRowProps) {
  return (
    <TouchableOpacity
      style={[
        styles.locationRow,
        isSelected && styles.locationRowSelected,
      ]}
      onPress={onSelect}
      activeOpacity={0.7}
    >
      <Text style={[styles.locationName, { color: textColor }]}>
        {location.name}
      </Text>
      <Text style={[styles.locationSubtitle, { color: secondaryTextColor }]}>
        {location.subtitle}
      </Text>
    </TouchableOpacity>
  );
}

export default function SelectLocationScreen() {
  const insets = useSafeAreaInsets();
  const textColor = useThemeColor({}, 'text');
  const secondaryTextColor = useThemeColor({}, 'secondaryText');
  const inputBackgroundColor = useThemeColor({}, 'inputBackground');
  const placeholderColor = useThemeColor({}, 'inputPlaceholder');
  const backgroundColor = useThemeColor({}, 'background');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  const filteredLocations = useMemo(() => {
    if (!searchQuery.trim()) {
      return MOCK_LOCATIONS;
    }
    const query = searchQuery.toLowerCase();
    return MOCK_LOCATIONS.filter(
      (location) =>
        location.name.toLowerCase().includes(query) ||
        location.subtitle.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  function handleBack() {
    router.back();
  }

  function handleContinue() {
    const selected = MOCK_LOCATIONS.find((loc) => loc.id === selectedLocation);
    console.log('Selected location:', selected);
    router.back();
  }

  function handleSelectLocation(locationId: string) {
    setSelectedLocation(locationId === selectedLocation ? null : locationId);
  }

  function renderLocation({ item }: { item: Location }) {
    return (
      <LocationRow
        location={item}
        isSelected={selectedLocation === item.id}
        onSelect={() => handleSelectLocation(item.id)}
        textColor={textColor}
        secondaryTextColor={secondaryTextColor}
      />
    );
  }

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={24} color={textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: textColor }]}>Select Location</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Search Input */}
      <View style={styles.searchWrapper}>
        <View style={[styles.searchContainer, { backgroundColor: inputBackgroundColor }]}>
          <IconSymbol name="magnifyingglass" size={20} color={placeholderColor} />
          <TextInput
            style={[styles.searchInput, { color: textColor }]}
            placeholder="Search location..."
            placeholderTextColor={placeholderColor}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
      </View>

      {/* Location List */}
      <FlatList
        data={filteredLocations}
        keyExtractor={(item) => item.id}
        renderItem={renderLocation}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: selectedLocation ? 120 + insets.bottom : insets.bottom + 20 },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      />

      {/* Continue Button (shows when location selected) */}
      {selectedLocation && (
        <View
          style={[
            styles.buttonContainer,
            { backgroundColor, paddingBottom: insets.bottom + 20 },
          ]}
        >
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
            activeOpacity={0.8}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      )}
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
    paddingVertical: 12,
    height: 69,
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
  searchWrapper: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    padding: 0,
  },
  listContent: {
    paddingTop: 0,
  },
  locationRow: {
    paddingHorizontal: 13,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#f5f5f5',
  },
  locationRowSelected: {
    backgroundColor: '#fffcf8',
    borderTopColor: 'rgba(232, 114, 0, 0.4)',
  },
  locationName: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 24,
  },
  locationSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 24,
    color: '#717680',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 32,
    paddingTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 14.4,
    elevation: 5,
  },
  continueButton: {
    backgroundColor: BrandColors.orange[500],
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  continueButtonText: {
    color: BrandColors.base.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
