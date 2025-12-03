import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { StoryGradients } from '@/constants/theme';

export type UserRole = 'member' | 'admin';

export interface StoryItemProps {
  id: string;
  username: string;
  avatar: string | null;
  isOwn?: boolean;
  hasUnseenStory?: boolean;
  userRole: UserRole;
  isAnnouncement?: boolean;
  onPress?: () => void;
}

export function StoryItem({
  username,
  avatar,
  isOwn = false,
  userRole,
  isAnnouncement = false,
  onPress,
}: StoryItemProps) {
  const memberRingColor = useThemeColor({}, 'memberRing');
  const backgroundColor = useThemeColor({}, 'background');
  const secondaryText = useThemeColor({}, 'secondaryText');

  const getRingStyle = () => {
    // Announcement takes priority
    if (isAnnouncement) {
      return 'announcement';
    }
    // Admin gets gradient
    if (userRole === 'admin') {
      return 'admin';
    }
    // Regular members get static ring
    return 'member';
  };

  const ringStyle = getRingStyle();

  const renderRing = () => {
    if (ringStyle === 'member') {
      // Static orange ring for members
      return (
        <View style={[styles.staticRing, { borderColor: memberRingColor }]}>
          <View style={[styles.avatarContainer, { backgroundColor }]}>
            {avatar ? (
              <Image source={{ uri: avatar }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatarPlaceholder, { backgroundColor: secondaryText }]}>
                <ThemedText style={styles.plusIcon}>+</ThemedText>
              </View>
            )}
          </View>
        </View>
      );
    }

    // Gradient ring for admin or announcement
    const gradientColors: readonly [string, string] = ringStyle === 'announcement'
      ? [StoryGradients.announcement.start, StoryGradients.announcement.end] as const
      : [StoryGradients.admin.start, StoryGradients.admin.end] as const;

    return (
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientRing}
      >
        <View style={[styles.avatarContainer, { backgroundColor }]}>
          {avatar ? (
            <Image source={{ uri: avatar }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatarPlaceholder, { backgroundColor: secondaryText }]}>
              <ThemedText style={styles.plusIcon}>+</ThemedText>
            </View>
          )}
        </View>
      </LinearGradient>
    );
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      {renderRing()}
      {isOwn && (
        <View style={styles.addBadge}>
          <ThemedText style={styles.addBadgeText}>+</ThemedText>
        </View>
      )}
      <ThemedText style={[styles.username, { color: secondaryText }]} numberOfLines={1}>
        {isOwn ? 'Your Story' : username}
      </ThemedText>
    </TouchableOpacity>
  );
}

const RING_SIZE = 76;
const RING_WIDTH = 2.5;
const AVATAR_CONTAINER_SIZE = RING_SIZE - (RING_WIDTH * 2); // 71
const AVATAR_SIZE = AVATAR_CONTAINER_SIZE - 4; // 67 (2px gap for spacing from ring)

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: 82,
  },
  staticRing: {
    width: RING_SIZE,
    height: RING_SIZE,
    borderRadius: RING_SIZE / 2,
    borderWidth: RING_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientRing: {
    width: RING_SIZE,
    height: RING_SIZE,
    borderRadius: RING_SIZE / 2,
    padding: RING_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarContainer: {
    width: AVATAR_CONTAINER_SIZE,
    height: AVATAR_CONTAINER_SIZE,
    borderRadius: AVATAR_CONTAINER_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
  },
  avatarPlaceholder: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusIcon: {
    fontSize: 24,
    color: '#fff',
    fontWeight: '300',
  },
  addBadge: {
    position: 'absolute',
    bottom: 22,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#0095F6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  addBadgeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    marginTop: -2,
  },
  username: {
    fontSize: 11,
    marginTop: 6,
    textAlign: 'center',
    width: '100%',
  },
});
