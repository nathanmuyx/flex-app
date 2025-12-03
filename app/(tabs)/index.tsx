import { useCallback } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

import { ThemedView } from '@/components/themed-view';
import { setPreviousTab } from '@/utils/navigation-state';
import { FeedHeader } from '@/components/feed/feed-header';
import { StoryItem, type UserRole } from '@/components/feed/story-item';
import { PostCard, type PostData } from '@/components/feed/post-card';
import { useThemeColor } from '@/hooks/use-theme-color';

// Mock data for stories
interface StoryData {
  id: string;
  username: string;
  avatar: string | null;
  isOwn: boolean;
  hasUnseenStory: boolean;
  userRole: UserRole;
  isAnnouncement: boolean;
}

const STORIES: StoryData[] = [
  { id: '0', username: 'Your Story', avatar: null, isOwn: true, hasUnseenStory: false, userRole: 'member', isAnnouncement: false },
  { id: '1', username: 'admin_john', avatar: 'https://i.pravatar.cc/100?img=1', isOwn: false, hasUnseenStory: true, userRole: 'admin', isAnnouncement: false },
  { id: '2', username: 'official', avatar: 'https://i.pravatar.cc/100?img=2', isOwn: false, hasUnseenStory: true, userRole: 'admin', isAnnouncement: true },
  { id: '3', username: 'jane_smith', avatar: 'https://i.pravatar.cc/100?img=3', isOwn: false, hasUnseenStory: true, userRole: 'member', isAnnouncement: false },
  { id: '4', username: 'mike_m', avatar: 'https://i.pravatar.cc/100?img=4', isOwn: false, hasUnseenStory: true, userRole: 'member', isAnnouncement: false },
  { id: '5', username: 'sarah_j', avatar: 'https://i.pravatar.cc/100?img=5', isOwn: false, hasUnseenStory: true, userRole: 'member', isAnnouncement: false },
  { id: '6', username: 'alex_dev', avatar: 'https://i.pravatar.cc/100?img=6', isOwn: false, hasUnseenStory: true, userRole: 'member', isAnnouncement: false },
];

// Mock data for posts
const POSTS: PostData[] = [
  {
    id: '1',
    user: {
      username: 'admin_john',
      avatar: 'https://i.pravatar.cc/100?img=1',
      role: 'admin',
    },
    image: 'https://picsum.photos/seed/post1/800/800',
    caption: 'Welcome to our community! Excited to share updates with everyone here.',
    reactions: [
      { emoji: '🔥', count: 24, hasReacted: true },
      { emoji: '👏', count: 18, hasReacted: false },
      { emoji: '❤️', count: 12, hasReacted: false },
      { emoji: '🚀', count: 8, hasReacted: false },
    ],
    commentsCount: 15,
    timeAgo: '2h ago',
    isAnnouncement: false,
  },
  {
    id: '2',
    user: {
      username: 'jane_smith',
      avatar: 'https://i.pravatar.cc/100?img=3',
      role: 'member',
    },
    image: 'https://picsum.photos/seed/post2/800/800',
    caption: 'Beautiful sunset from my balcony today! Nature never disappoints.',
    reactions: [
      { emoji: '😍', count: 45, hasReacted: true },
      { emoji: '✨', count: 23, hasReacted: false },
      { emoji: '🌅', count: 15, hasReacted: true },
    ],
    commentsCount: 8,
    timeAgo: '4h ago',
    isAnnouncement: false,
  },
  {
    id: '3',
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
    id: '4',
    user: {
      username: 'sarah_j',
      avatar: 'https://i.pravatar.cc/100?img=5',
      role: 'member',
    },
    image: 'https://picsum.photos/seed/post4/800/800',
    caption: 'Just finished my first project! So proud of how far I have come.',
    reactions: [
      { emoji: '🎉', count: 89, hasReacted: true },
      { emoji: '👏', count: 56, hasReacted: false },
      { emoji: '💪', count: 34, hasReacted: false },
      { emoji: '🙌', count: 21, hasReacted: false },
    ],
    commentsCount: 42,
    timeAgo: '1d ago',
    isAnnouncement: false,
  },
];

function StoriesList() {
  const separatorColor = useThemeColor({}, 'separator');

  return (
    <View style={[styles.storiesContainer, { borderBottomColor: separatorColor }]}>
      <FlatList
        data={STORIES}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <StoryItem
            {...item}
            onPress={() => !item.isOwn && router.push(`/story/${item.id}`)}
          />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.storiesContent}
      />
    </View>
  );
}

export default function HomeScreen() {
  const backgroundColor = useThemeColor({}, 'background');

  // Track this tab as the previous tab for back navigation
  useFocusEffect(
    useCallback(() => {
      setPreviousTab('/(tabs)');
    }, [])
  );

  // Sort posts: announcements first, then by time
  const sortedPosts = [...POSTS].sort((a, b) => {
    if (a.isAnnouncement && !b.isAnnouncement) return -1;
    if (!a.isAnnouncement && b.isAnnouncement) return 1;
    return 0;
  });

  return (
    <ThemedView style={styles.container}>
      <FeedHeader />
      <FlatList
        data={sortedPosts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PostCard
            post={item}
            onPress={() => router.push(`/post/${item.id}`)}
            onCommentPress={() => router.push(`/post/${item.id}`)}
          />
        )}
        ListHeaderComponent={<StoriesList />}
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
  feedContent: {
    paddingBottom: TAB_BAR_HEIGHT,
  },
  storiesContainer: {
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    marginBottom: 8,
  },
  storiesContent: {
    paddingHorizontal: 12,
    gap: 8,
  },
});
