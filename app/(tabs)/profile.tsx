import { useCallback } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ScrollView,
} from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { setPreviousTab } from '@/utils/navigation-state';
import { useAuth } from '@/contexts/AuthContext';
import { useThemeColor } from '@/hooks/use-theme-color';
import { BrandColors } from '@/constants/theme';

// Mock user posts for the grid
const MOCK_POSTS = Array.from({ length: 12 }, (_, i) => ({
  id: `post-${i}`,
  uri: `https://picsum.photos/seed/profile${i + 1}/400/400`,
}));

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GAP = 2;
const NUM_COLUMNS = 3;
const TILE_SIZE = (SCREEN_WIDTH - GAP * (NUM_COLUMNS - 1)) / NUM_COLUMNS;

const AVATAR_SIZE = 100;

function ProfileHeader({ onLogout }: { onLogout: () => void }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: insets.top }]}>
      <View style={styles.headerSpacer} />
      <ThemedText type="defaultSemiBold" style={styles.headerTitle}>
        Profile
      </ThemedText>
      <TouchableOpacity style={styles.headerButton} onPress={onLogout}>
        <IconSymbol name="sign-out" size={24} color={BrandColors.error[500]} />
      </TouchableOpacity>
    </View>
  );
}

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const textColor = useThemeColor({}, 'text');
  const secondaryText = useThemeColor({}, 'secondaryText');
  const borderColor = useThemeColor({}, 'inputBorder');
  const backgroundColor = useThemeColor({}, 'background');

  // Track this tab as the previous tab for back navigation
  useFocusEffect(
    useCallback(() => {
      setPreviousTab('/(tabs)/profile');
    }, [])
  );

  async function handleLogout() {
    await logout();
    router.replace('/login');
  }

  function handleEditProfile() {
    // TODO: Navigate to edit profile screen
    console.log('Edit profile pressed');
  }

  function handlePostPress(postId: string) {
    // TODO: Navigate to post detail
    console.log('Post pressed:', postId);
  }

  const renderPostTile = ({ item }: { item: (typeof MOCK_POSTS)[0] }) => (
    <TouchableOpacity
      style={styles.postTile}
      onPress={() => handlePostPress(item.id)}
      activeOpacity={0.8}
    >
      <Image source={{ uri: item.uri }} style={styles.postImage} contentFit="cover" />
    </TouchableOpacity>
  );

  // Extract username from email
  const username = user?.email?.split('@')[0] || 'user';

  return (
    <ThemedView style={styles.container}>
      <ProfileHeader onLogout={handleLogout} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Info Section */}
        <View style={styles.profileSection}>
          {/* Avatar */}
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: `https://i.pravatar.cc/200?u=${user?.email || 'default'}` }}
              style={styles.avatar}
              contentFit="cover"
            />
          </View>

          {/* Username with verified badge */}
          <View style={styles.usernameRow}>
            <ThemedText
              type="defaultSemiBold"
              style={[styles.username, user?.role === 'admin' && styles.adminUsername]}
            >
              @{username}
            </ThemedText>
            {user?.role === 'admin' && (
              <IconSymbol
                name="seal-check"
                size={18}
                color={BrandColors.green[500]}
                weight="fill"
              />
            )}
          </View>
          {user?.name && (
            <ThemedText style={[styles.displayName, { color: secondaryText }]}>
              {user.name}
            </ThemedText>
          )}
          {user?.role && (
            <ThemedText style={[styles.roleText, { color: secondaryText }]}>
              {user.role === 'admin' ? 'Administrator' : 'Member'}
            </ThemedText>
          )}

          {/* Edit Profile Button */}
          <TouchableOpacity
            style={[styles.editProfileButton, { borderColor }]}
            onPress={handleEditProfile}
            activeOpacity={0.7}
          >
            <ThemedText style={styles.editProfileText}>Edit Profile</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Grid Type Selector */}
        <View style={[styles.gridSelector, { borderColor }]}>
          <TouchableOpacity style={styles.gridTypeButton}>
            <IconSymbol name="grid" size={24} color={textColor} />
          </TouchableOpacity>
        </View>

        {/* Posts Grid */}
        <View style={styles.gridContainer}>
          <FlatList
            data={MOCK_POSTS}
            renderItem={renderPostTile}
            keyExtractor={(item) => item.id}
            numColumns={NUM_COLUMNS}
            scrollEnabled={false}
            columnWrapperStyle={styles.gridRow}
            contentContainerStyle={styles.gridContent}
          />
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const TAB_BAR_HEIGHT = 90;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  headerSpacer: {
    width: 24,
  },
  headerTitle: {
    fontSize: 18,
  },
  headerButton: {
    padding: 4,
  },
  scrollContent: {
    paddingBottom: TAB_BAR_HEIGHT + 20,
  },
  profileSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: BrandColors.gray[200],
  },
  usernameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  username: {
    fontSize: 18,
  },
  adminUsername: {
    color: BrandColors.green[500],
  },
  roleText: {
    fontSize: 12,
    marginBottom: 8,
  },
  displayName: {
    fontSize: 14,
    marginBottom: 16,
  },
  editProfileButton: {
    width: '100%',
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  editProfileText: {
    fontSize: 14,
    fontWeight: '600',
  },
  gridSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingVertical: 12,
  },
  gridTypeButton: {
    paddingHorizontal: 32,
  },
  gridContainer: {
    flex: 1,
  },
  gridContent: {
    // No extra padding needed
  },
  gridRow: {
    gap: GAP,
    marginBottom: GAP,
  },
  postTile: {
    width: TILE_SIZE,
    height: TILE_SIZE,
    backgroundColor: BrandColors.gray[200],
  },
  postImage: {
    width: '100%',
    height: '100%',
  },
});
