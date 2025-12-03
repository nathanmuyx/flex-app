import { useCallback } from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

import { ThemedView } from '@/components/themed-view';
import { setPreviousTab } from '@/utils/navigation-state';
import { ThemedText } from '@/components/themed-text';
import { PostCard, type PostData } from '@/components/feed/post-card';
import { useThemeColor } from '@/hooks/use-theme-color';

// Mock announcement posts (filter from all posts or fetch separately)
const ANNOUNCEMENTS: PostData[] = [
  {
    id: 'ann-1',
    user: {
      username: 'admin_john',
      avatar: 'https://i.pravatar.cc/100?img=1',
      role: 'admin',
    },
    image: 'https://picsum.photos/seed/post3/800/800',
    caption: 'Quick reminder: Please keep discussions respectful. Community guidelines updated!',
    reactions: [
      { emoji: '👍', count: 67, hasReacted: false },
      { emoji: '💯', count: 34, hasReacted: false },
    ],
    commentsCount: 23,
    timeAgo: '6h ago',
    isAnnouncement: true,
  },
  {
    id: 'ann-2',
    user: {
      username: 'admin_sarah',
      avatar: 'https://i.pravatar.cc/100?img=5',
      role: 'admin',
    },
    image: 'https://picsum.photos/seed/ann2/800/800',
    caption: 'New feature alert! You can now react to posts with custom emojis. Try it out!',
    reactions: [
      { emoji: '🎉', count: 89, hasReacted: true },
      { emoji: '🚀', count: 45, hasReacted: false },
    ],
    commentsCount: 31,
    timeAgo: '1d ago',
    isAnnouncement: true,
  },
  {
    id: 'ann-3',
    user: {
      username: 'admin_john',
      avatar: 'https://i.pravatar.cc/100?img=1',
      role: 'admin',
    },
    image: 'https://picsum.photos/seed/ann3/800/800',
    caption: 'Scheduled maintenance this weekend. The app may be unavailable for a few hours on Saturday night.',
    reactions: [
      { emoji: '👍', count: 28, hasReacted: false },
    ],
    commentsCount: 12,
    timeAgo: '2d ago',
    isAnnouncement: true,
  },
  {
    id: 'ann-4',
    user: {
      username: 'admin_mike',
      avatar: 'https://i.pravatar.cc/100?img=8',
      role: 'admin',
    },
    image: 'https://picsum.photos/seed/ann4/800/800',
    caption: 'Welcome to all our new members! Feel free to introduce yourself in the community section.',
    reactions: [
      { emoji: '👋', count: 156, hasReacted: false },
      { emoji: '❤️', count: 78, hasReacted: true },
    ],
    commentsCount: 67,
    timeAgo: '3d ago',
    isAnnouncement: true,
  },
  {
    id: 'ann-5',
    user: {
      username: 'admin_sarah',
      avatar: 'https://i.pravatar.cc/100?img=5',
      role: 'admin',
    },
    image: 'https://picsum.photos/seed/ann5/800/800',
    caption: 'Contest announcement: Share your best photos this month for a chance to win prizes!',
    reactions: [
      { emoji: '📸', count: 234, hasReacted: false },
      { emoji: '🏆', count: 89, hasReacted: false },
    ],
    commentsCount: 45,
    timeAgo: '5d ago',
    isAnnouncement: true,
  },
  {
    id: 'ann-6',
    user: {
      username: 'admin_john',
      avatar: 'https://i.pravatar.cc/100?img=1',
      role: 'admin',
    },
    image: 'https://picsum.photos/seed/ann6/800/800',
    caption: 'Privacy policy update: We have updated our terms. Please review the changes in settings.',
    reactions: [
      { emoji: '👍', count: 45, hasReacted: false },
    ],
    commentsCount: 8,
    timeAgo: '1w ago',
    isAnnouncement: true,
  },
];

function AnnouncementHeader() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.headerContainer, { paddingTop: insets.top }]}>
      <Text style={styles.headerTitle}>Official Announcements</Text>
    </View>
  );
}

export default function AnnouncementScreen() {
  const backgroundColor = useThemeColor({}, 'background');
  const secondaryText = useThemeColor({}, 'secondaryText');

  // Track this tab as the previous tab for back navigation
  useFocusEffect(
    useCallback(() => {
      setPreviousTab('/(tabs)/announcement');
    }, [])
  );

  if (ANNOUNCEMENTS.length === 0) {
    return (
      <ThemedView style={styles.container}>
        <AnnouncementHeader />
        <View style={styles.emptyState}>
          <ThemedText style={[styles.emptyText, { color: secondaryText }]}>
            No announcements yet
          </ThemedText>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <AnnouncementHeader />
      <FlatList
        data={ANNOUNCEMENTS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PostCard post={item} hideAnnouncementStyle />}
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor }}
        contentContainerStyle={styles.feedContent}
      />
    </ThemedView>
  );
}

const TAB_BAR_HEIGHT = 90;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    backgroundColor: '#216A38',
    paddingHorizontal: 13,
    paddingVertical: 12,
    alignItems: 'flex-start',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontFamily: 'MontserratAlternates_700Bold',
    fontSize: 20,
  },
  feedContent: {
    paddingBottom: TAB_BAR_HEIGHT,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
  },
});
