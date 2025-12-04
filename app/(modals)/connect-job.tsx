import { useState, useMemo, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  Modal,
  Animated,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { BrandColors } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';

interface Job {
  id: string;
  customerName: string;
  jobType: 'moving' | 'junk_removal';
  jobId: string;
  date: string;
  time: string;
  avatar: string;
  origin?: string;
  destination?: string;
  location?: string;
}

// Mock jobs data
const MOCK_JOBS: Job[] = [
  {
    id: '1',
    customerName: 'Bob Fischer',
    jobType: 'moving',
    jobId: '34898',
    date: 'Nov, 10 2025',
    time: '8:00 Pm',
    avatar: 'https://i.pravatar.cc/100?img=10',
    origin: 'Chicago, 123 District',
    destination: 'Chicago, 1 District',
  },
  {
    id: '2',
    customerName: 'Bob Fischer',
    jobType: 'junk_removal',
    jobId: '34898',
    date: 'Nov, 10 2025',
    time: '8:00 Pm',
    avatar: 'https://i.pravatar.cc/100?img=10',
    location: 'Chicago, 123 District',
  },
  {
    id: '3',
    customerName: 'Sarah Johnson',
    jobType: 'moving',
    jobId: '34901',
    date: 'Nov, 12 2025',
    time: '10:00 Am',
    avatar: 'https://i.pravatar.cc/100?img=15',
    origin: 'Evanston, 45 Oak St',
    destination: 'Skokie, 120 Main Ave',
  },
  {
    id: '4',
    customerName: 'Mike Williams',
    jobType: 'junk_removal',
    jobId: '34905',
    date: 'Nov, 15 2025',
    time: '2:00 Pm',
    avatar: 'https://i.pravatar.cc/100?img=20',
    location: 'Oak Park, 78 Elm St',
  },
];

interface JobCardProps {
  job: Job;
  onConnect: () => void;
  secondaryTextColor: string;
}

function JobCard({ job, onConnect, secondaryTextColor }: JobCardProps) {
  const isMovingJob = job.jobType === 'moving';
  const jobTypeLabel = isMovingJob ? 'Moving Job' : 'Junk Removal';

  return (
    <View style={styles.jobCard}>
      {/* User row */}
      <View style={styles.jobHeader}>
        <Image source={{ uri: job.avatar }} style={styles.avatar} contentFit="cover" />
        <View style={styles.jobInfo}>
          <Text style={styles.customerName}>{job.customerName}</Text>
          <Text style={styles.jobType}>
            <Text style={styles.jobTypeLabel}>{jobTypeLabel} </Text>
            <Text style={styles.jobId}>ID {job.jobId}</Text>
          </Text>
        </View>
      </View>

      {/* Date/Time row */}
      <View style={styles.detailsRow}>
        <View style={styles.detailItem}>
          <IconSymbol name="calendar" size={14} color={secondaryTextColor} />
          <Text style={[styles.detailText, { color: secondaryTextColor }]}>{job.date}</Text>
        </View>
        <View style={styles.detailItem}>
          <IconSymbol name="clock" size={14} color={secondaryTextColor} />
          <Text style={[styles.detailText, { color: secondaryTextColor }]}>{job.time}</Text>
        </View>
      </View>

      {/* Location row(s) */}
      <View style={styles.locationRow}>
        {isMovingJob ? (
          <>
            <View style={styles.detailItem}>
              <IconSymbol name="truck" size={14} color={secondaryTextColor} />
              <Text style={[styles.detailText, { color: secondaryTextColor }]}>{job.origin}</Text>
            </View>
            <View style={styles.detailItem}>
              <IconSymbol name="map-pin" size={14} color={secondaryTextColor} />
              <Text style={[styles.detailText, { color: secondaryTextColor }]}>{job.destination}</Text>
            </View>
          </>
        ) : (
          <View style={styles.detailItem}>
            <IconSymbol name="truck" size={14} color={secondaryTextColor} />
            <Text style={[styles.detailText, { color: secondaryTextColor }]}>{job.location}</Text>
          </View>
        )}
      </View>

      {/* Connect button */}
      <TouchableOpacity style={styles.connectButton} onPress={onConnect} activeOpacity={0.8}>
        <Text style={styles.connectButtonText}>Connect</Text>
      </TouchableOpacity>
    </View>
  );
}

interface LocationModalProps {
  visible: boolean;
  job: Job | null;
  onSelectLocation: (type: 'origin' | 'destination' | 'custom') => void;
  onCancel: () => void;
}

const SCREEN_HEIGHT = Dimensions.get('window').height;

function LocationSelectionModal({ visible, job, onSelectLocation, onCancel }: LocationModalProps) {
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  useEffect(() => {
    if (visible) {
      // Animate in
      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 65,
          friction: 11,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Reset values when hidden
      overlayOpacity.setValue(0);
      slideAnim.setValue(SCREEN_HEIGHT);
    }
  }, [visible, overlayOpacity, slideAnim]);

  function handleClose() {
    Animated.parallel([
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onCancel();
    });
  }

  if (!visible || !job) return null;

  return (
    <Modal transparent visible={visible} animationType="none">
      <View style={styles.modalContainer}>
        {/* Overlay - fades in */}
        <Animated.View
          style={[
            styles.modalOverlay,
            { opacity: overlayOpacity },
          ]}
        >
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={handleClose}
          />
        </Animated.View>

        {/* Bottom Sheet - slides up */}
        <Animated.View
          style={[
            styles.modalContent,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
            <Text style={styles.modalTitle}>Where was this taken?</Text>

            <View style={styles.modalOptions}>
              {/* Origin Option */}
              <TouchableOpacity
                style={styles.locationOption}
                onPress={() => onSelectLocation('origin')}
                activeOpacity={0.7}
              >
                <View style={[styles.locationIconBg, styles.originIconBg]}>
                  <IconSymbol name="truck" size={24} color={BrandColors.green[600]} />
                </View>
                <View style={styles.locationOptionText}>
                  <Text style={styles.locationOptionLabel}>Origin</Text>
                  <Text style={styles.locationOptionAddress}>{job.origin}</Text>
                </View>
                <IconSymbol name="chevron.right" size={24} color={BrandColors.gray[400]} />
              </TouchableOpacity>

              {/* Destination Option */}
              <TouchableOpacity
                style={styles.locationOption}
                onPress={() => onSelectLocation('destination')}
                activeOpacity={0.7}
              >
                <View style={[styles.locationIconBg, styles.destinationIconBg]}>
                  <IconSymbol name="map-pin" size={24} color={BrandColors.orange[500]} />
                </View>
                <View style={styles.locationOptionText}>
                  <Text style={styles.locationOptionLabel}>Destination</Text>
                  <Text style={styles.locationOptionAddress}>{job.destination}</Text>
                </View>
                <IconSymbol name="chevron.right" size={24} color={BrandColors.gray[400]} />
              </TouchableOpacity>

              {/* Custom Location Option */}
              <TouchableOpacity
                style={styles.locationOption}
                onPress={() => onSelectLocation('custom')}
                activeOpacity={0.7}
              >
                <View style={[styles.locationIconBg, styles.customIconBg]}>
                  <IconSymbol name="crosshair" size={24} color={BrandColors.gray[500]} />
                </View>
                <View style={styles.locationOptionText}>
                  <Text style={styles.locationOptionLabel}>Custom Location</Text>
                  <Text style={styles.locationOptionAddress}>Choose a location</Text>
                </View>
                <IconSymbol name="chevron.right" size={24} color={BrandColors.gray[400]} />
              </TouchableOpacity>
            </View>

            {/* Cancel */}
            <TouchableOpacity onPress={handleClose} style={styles.cancelButton}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

export default function ConnectJobScreen() {
  const insets = useSafeAreaInsets();
  const textColor = useThemeColor({}, 'text');
  const secondaryTextColor = useThemeColor({}, 'secondaryText');
  const inputBackgroundColor = useThemeColor({}, 'inputBackground');
  const placeholderColor = useThemeColor({}, 'inputPlaceholder');

  const [searchQuery, setSearchQuery] = useState('');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const filteredJobs = useMemo(() => {
    if (!searchQuery.trim()) {
      return MOCK_JOBS;
    }
    const query = searchQuery.toLowerCase();
    return MOCK_JOBS.filter((job) =>
      job.customerName.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  function handleBack() {
    router.back();
  }

  function handleConnect(job: Job) {
    if (job.jobType === 'moving') {
      // Show location selection modal for moving jobs
      setSelectedJob(job);
      setShowLocationModal(true);
    } else {
      // Connect directly for junk removal jobs
      console.log('Connected to job:', job.id, 'with location:', job.location);
      router.back();
    }
  }

  function handleSelectLocation(type: 'origin' | 'destination' | 'custom') {
    if (!selectedJob) return;

    if (type === 'custom') {
      // Navigate to custom location picker
      setShowLocationModal(false);
      router.push('/(modals)/select-location');
    } else {
      const location = type === 'origin' ? selectedJob.origin : selectedJob.destination;
      console.log('Connected to job:', selectedJob.id, 'with location:', location);
      setShowLocationModal(false);
      router.back();
    }
  }

  function handleCancelModal() {
    setShowLocationModal(false);
    setSelectedJob(null);
  }

  function renderJob({ item }: { item: Job }) {
    return (
      <JobCard
        job={item}
        onConnect={() => handleConnect(item)}
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
        <Text style={[styles.headerTitle, { color: textColor }]}>Connect to a Job</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Search Input */}
      <View style={styles.searchWrapper}>
        <View style={[styles.searchContainer, { backgroundColor: inputBackgroundColor }]}>
          <IconSymbol name="magnifyingglass" size={28} color={placeholderColor} />
          <TextInput
            style={[styles.searchInput, { color: textColor }]}
            placeholder="Search by name..."
            placeholderTextColor={placeholderColor}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
      </View>

      {/* Job List */}
      <FlatList
        data={filteredJobs}
        keyExtractor={(item) => item.id}
        renderItem={renderJob}
        contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 20 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      {/* Location Selection Modal (for Moving Jobs) */}
      <LocationSelectionModal
        visible={showLocationModal}
        job={selectedJob}
        onSelectLocation={handleSelectLocation}
        onCancel={handleCancelModal}
      />
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
    fontSize: 16,
    padding: 0,
  },
  listContent: {
    paddingTop: 0,
  },
  separator: {
    height: 14,
  },
  // Job Card Styles
  jobCard: {
    backgroundColor: BrandColors.base.white,
    paddingHorizontal: 12,
    paddingVertical: 14,
    gap: 8,
  },
  jobHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 0.345,
    borderColor: '#dddddd',
    backgroundColor: BrandColors.gray[200],
  },
  jobInfo: {
    flex: 1,
    gap: 4,
  },
  customerName: {
    fontSize: 12,
    fontWeight: '700',
    color: BrandColors.orange[500],
  },
  jobType: {
    flexDirection: 'row',
  },
  jobTypeLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: '#6e6e6e',
  },
  jobId: {
    fontSize: 10,
    fontWeight: '400',
    color: '#969696',
  },
  detailsRow: {
    flexDirection: 'row',
    gap: 9,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 10,
    fontWeight: '500',
  },
  locationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  connectButton: {
    backgroundColor: BrandColors.orange[500],
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 16,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  connectButtonText: {
    color: BrandColors.base.white,
    fontSize: 12,
    fontWeight: '600',
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(16, 24, 40, 0.5)',
  },
  modalContent: {
    backgroundColor: BrandColors.base.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#101828',
    marginBottom: 4,
    letterSpacing: -0.45,
  },
  modalOptions: {
    paddingVertical: 12,
    gap: 12,
  },
  locationOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BrandColors.base.white,
    borderWidth: 1,
    borderColor: BrandColors.gray[300],
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 16,
    gap: 12,
  },
  locationIconBg: {
    width: 36,
    height: 36,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  originIconBg: {
    backgroundColor: '#d9f5e1',
  },
  destinationIconBg: {
    backgroundColor: 'rgba(232, 114, 0, 0.2)',
  },
  customIconBg: {
    backgroundColor: '#f0f0f0',
  },
  locationOptionText: {
    flex: 1,
    gap: 8,
  },
  locationOptionLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: BrandColors.gray[500],
  },
  locationOptionAddress: {
    fontSize: 10,
    fontWeight: '500',
    color: '#9fabc4',
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ababab',
  },
});
