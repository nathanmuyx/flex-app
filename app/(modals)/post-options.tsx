import { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Switch,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedView } from '@/components/themed-view';
import { getPreviousTab } from '@/utils/navigation-state';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { BrandColors } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';

const THUMBNAIL_SIZE = 64;
const THUMBNAIL_GAP = 8;

interface OptionCardProps {
  icon: string;
  label: string;
  onPress: () => void;
}

function OptionCard({ icon, label, onPress }: OptionCardProps) {
  return (
    <TouchableOpacity
      style={styles.optionCard}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.optionIconContainer}>
        <IconSymbol name={icon as any} size={24} color={BrandColors.gray[600]} />
      </View>
      <View style={styles.optionLabelContainer}>
        <Text style={styles.optionCardLabel}>{label}</Text>
      </View>
      <IconSymbol name="chevron.right" size={24} color={BrandColors.gray[400]} />
    </TouchableOpacity>
  );
}

interface EventAccordionCardProps {
  isEvent: boolean;
  onToggle: (value: boolean) => void;
  eventTitle: string;
  onEventTitleChange: (value: string) => void;
  eventCity: string;
  onEventCityChange: (value: string) => void;
  eventDistrict: string;
  onEventDistrictChange: (value: string) => void;
  inputBackgroundColor: string;
  inputBorderColor: string;
  inputTextColor: string;
  inputPlaceholderColor: string;
}

function EventAccordionCard({
  isEvent,
  onToggle,
  eventTitle,
  onEventTitleChange,
  eventCity,
  onEventCityChange,
  eventDistrict,
  onEventDistrictChange,
  inputBackgroundColor,
  inputBorderColor,
  inputTextColor,
  inputPlaceholderColor,
}: EventAccordionCardProps) {
  return (
    <View style={[
      styles.eventCard,
      isEvent && styles.eventCardActive,
    ]}>
      {/* Header */}
      <View style={styles.eventCardHeader}>
        <View style={[
          styles.optionIconContainer,
          isEvent && styles.eventIconActive,
        ]}>
          <IconSymbol
            name="megaphone"
            size={24}
            color={isEvent ? BrandColors.base.white : BrandColors.gray[600]}
          />
        </View>
        <View style={styles.optionLabelContainer}>
          <Text style={[
            styles.optionCardLabel,
            isEvent && styles.eventLabelActive,
          ]}>
            This is an event
          </Text>
        </View>
        <Switch
          value={isEvent}
          onValueChange={onToggle}
          trackColor={{ false: BrandColors.gray[300], true: '#088a4c' }}
          thumbColor={BrandColors.base.white}
        />
      </View>

      {/* Accordion Content */}
      {isEvent && (
        <View style={styles.eventAccordionContent}>
          {/* Event Title */}
          <View style={styles.eventInputContainer}>
            <Text style={styles.eventInputLabel}>Event Title</Text>
            <TextInput
              style={[
                styles.eventInput,
                {
                  backgroundColor: inputBackgroundColor,
                  borderColor: inputBorderColor,
                  color: inputTextColor,
                },
              ]}
              value={eventTitle}
              onChangeText={onEventTitleChange}
              placeholder="Enter event title"
              placeholderTextColor={inputPlaceholderColor}
            />
          </View>

          {/* City */}
          <View style={styles.eventInputContainer}>
            <Text style={styles.eventInputLabel}>City</Text>
            <TextInput
              style={[
                styles.eventInput,
                {
                  backgroundColor: inputBackgroundColor,
                  borderColor: inputBorderColor,
                  color: inputTextColor,
                },
              ]}
              value={eventCity}
              onChangeText={onEventCityChange}
              placeholder="Enter city"
              placeholderTextColor={inputPlaceholderColor}
            />
          </View>

          {/* District */}
          <View style={styles.eventInputContainer}>
            <Text style={styles.eventInputLabel}>District</Text>
            <TextInput
              style={[
                styles.eventInput,
                {
                  backgroundColor: inputBackgroundColor,
                  borderColor: inputBorderColor,
                  color: inputTextColor,
                },
              ]}
              value={eventDistrict}
              onChangeText={onEventDistrictChange}
              placeholder="Enter district"
              placeholderTextColor={inputPlaceholderColor}
            />
          </View>
        </View>
      )}
    </View>
  );
}

export default function PostOptionsModal() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ photos?: string }>();
  const photoUris: string[] = params.photos ? JSON.parse(params.photos) : [];

  const textColor = useThemeColor({}, 'text');
  const placeholderColor = useThemeColor({}, 'inputPlaceholder');
  const borderColor = useThemeColor({}, 'inputBorder');
  const inputBackgroundColor = useThemeColor({}, 'inputBackground');

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [caption, setCaption] = useState('');
  const [isEvent, setIsEvent] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventCity, setEventCity] = useState('');
  const [eventDistrict, setEventDistrict] = useState('');

  const selectedPhoto = photoUris[selectedIndex] || photoUris[0];

  function handleBack() {
    router.back();
  }

  function handleShare() {
    console.log('Sharing post:', {
      photos: photoUris,
      caption,
      isEvent,
      ...(isEvent && {
        eventTitle,
        eventCity,
        eventDistrict,
      }),
    });
    router.replace(getPreviousTab());
  }

  function handleEditImage() {
    console.log('Edit image:', selectedIndex);
  }

  function handleAddTags() {
    router.push('/(modals)/tag-users');
  }

  function handleAddLocation() {
    router.push('/(modals)/select-location');
  }

  function handleConnectJob() {
    router.push('/(modals)/connect-job');
  }

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={24} color={textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: textColor }]}>New Post</Text>
        <TouchableOpacity onPress={handleShare}>
          <Text style={styles.shareButton}>Share</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 20 }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
        {/* Main Image Preview */}
        <View style={styles.previewContainer}>
          {selectedPhoto ? (
            <Image
              source={{ uri: selectedPhoto }}
              style={styles.previewImage}
              contentFit="cover"
            />
          ) : (
            <View style={[styles.previewPlaceholder, { backgroundColor: BrandColors.gray[200] }]}>
              <IconSymbol name="photo" size={48} color={BrandColors.gray[400]} />
            </View>
          )}
        </View>

        {/* Thumbnail Strip */}
        {photoUris.length > 1 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.thumbnailStrip}
          >
            {photoUris.map((uri, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedIndex(index)}
                activeOpacity={0.8}
              >
                <Image
                  source={{ uri }}
                  style={[
                    styles.thumbnail,
                    selectedIndex === index && styles.thumbnailSelected,
                  ]}
                  contentFit="cover"
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Caption Input */}
        <View style={[styles.captionContainer, { borderBottomColor: borderColor }]}>
          <TextInput
            style={[styles.captionInput, { color: textColor }]}
            placeholder="Write a caption..."
            placeholderTextColor={placeholderColor}
            value={caption}
            onChangeText={setCaption}
            multiline
            maxLength={2200}
          />
        </View>

        {/* Additional Settings */}
        <View style={styles.optionsContainer}>
          <OptionCard
            icon="photo"
            label="Edit Individual Images"
            onPress={handleEditImage}
          />
          <OptionCard
            icon="tag"
            label="Add tag to all photos"
            onPress={handleAddTags}
          />
          <OptionCard
            icon="map-pin"
            label="Add Location to all photos"
            onPress={handleAddLocation}
          />
          <OptionCard
            icon="briefcase"
            label="Connect to a Job to this post"
            onPress={handleConnectJob}
          />
          <EventAccordionCard
            isEvent={isEvent}
            onToggle={setIsEvent}
            eventTitle={eventTitle}
            onEventTitleChange={setEventTitle}
            eventCity={eventCity}
            onEventCityChange={setEventCity}
            eventDistrict={eventDistrict}
            onEventDistrictChange={setEventDistrict}
            inputBackgroundColor={inputBackgroundColor}
            inputBorderColor={borderColor}
            inputTextColor={textColor}
            inputPlaceholderColor={placeholderColor}
          />
        </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 24,
    height: 24,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  shareButton: {
    fontSize: 16,
    fontWeight: '600',
    color: BrandColors.orange[500],
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  previewContainer: {
    marginBottom: 12,
  },
  previewImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
  },
  previewPlaceholder: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnailStrip: {
    paddingBottom: 16,
    gap: THUMBNAIL_GAP,
  },
  thumbnail: {
    width: THUMBNAIL_SIZE,
    height: THUMBNAIL_SIZE,
    borderRadius: 8,
    backgroundColor: BrandColors.gray[200],
  },
  thumbnailSelected: {
    borderWidth: 2,
    borderColor: BrandColors.orange[500],
  },
  captionContainer: {
    borderBottomWidth: 1,
    paddingVertical: 16,
    marginBottom: 8,
  },
  captionInput: {
    fontSize: 16,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  optionsContainer: {
    marginTop: 8,
    gap: 12,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BrandColors.base.white,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: BrandColors.gray[300],
    borderRadius: 8,
    paddingHorizontal: 13,
    paddingVertical: 16,
    gap: 12,
  },
  optionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: BrandColors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionLabelContainer: {
    flex: 1,
  },
  optionCardLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: BrandColors.gray[500],
  },
  // Event Accordion Styles
  eventCard: {
    backgroundColor: BrandColors.base.white,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: BrandColors.gray[300],
    borderRadius: 8,
    overflow: 'hidden',
  },
  eventCardActive: {
    backgroundColor: '#fffcf8',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'rgba(232, 114, 0, 0.4)',
    borderRadius: 12,
  },
  eventCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
    paddingVertical: 16,
    gap: 12,
  },
  eventIconActive: {
    backgroundColor: BrandColors.orange[500],
  },
  eventLabelActive: {
    color: BrandColors.orange[500],
  },
  eventAccordionContent: {
    backgroundColor: BrandColors.base.white,
    borderTopWidth: 1,
    borderTopColor: 'rgba(232, 114, 0, 0.4)',
    paddingVertical: 15,
  },
  eventInputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  eventInputLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: BrandColors.gray[400],
    marginBottom: 6,
  },
  eventInput: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
});
