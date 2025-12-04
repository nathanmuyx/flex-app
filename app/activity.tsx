import { SectionList, StyleSheet, View, Text } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { ActivityItem, type ActivityItemData } from '@/components/activity/activity-item';
import { useThemeColor } from '@/hooks/use-theme-color';
import { BrandColors } from '@/constants/theme';

// Mock data for activity
const MOCK_ACTIVITY: ActivityItemData[] = [
  // Today
  {
    id: '1',
    type: 'like',
    actor: { username: 'john_doe', avatar: 'https://i.pravatar.cc/100?img=1' },
    postId: '1',
    postThumbnail: 'https://picsum.photos/seed/post1/100/100',
    timestamp: '2h',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    isRead: false,
  },
  {
    id: '2',
    type: 'comment',
    actor: { username: 'jane_smith', avatar: 'https://i.pravatar.cc/100?img=2' },
    postId: '1',
    postThumbnail: 'https://picsum.photos/seed/post1/100/100',
    content: 'Great post! Love it',
    timestamp: '3h',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    isRead: false,
  },
  {
    id: '3',
    type: 'like',
    actor: { username: 'mike_wilson', avatar: 'https://i.pravatar.cc/100?img=3' },
    postId: '2',
    postThumbnail: 'https://picsum.photos/seed/post2/100/100',
    timestamp: '5h',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    isRead: true,
  },
  // This Week
  {
    id: '4',
    type: 'comment',
    actor: { username: 'sarah_jones', avatar: 'https://i.pravatar.cc/100?img=4' },
    postId: '3',
    postThumbnail: 'https://picsum.photos/seed/post3/100/100',
    content: 'Amazing work!',
    timestamp: '2d',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    isRead: true,
  },
  {
    id: '5',
    type: 'like',
    actor: { username: 'alex_brown', avatar: 'https://i.pravatar.cc/100?img=5' },
    postId: '3',
    postThumbnail: 'https://picsum.photos/seed/post3/100/100',
    timestamp: '3d',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    isRead: true,
  },
  {
    id: '6',
    type: 'mention',
    actor: { username: 'chris_lee', avatar: 'https://i.pravatar.cc/100?img=6' },
    postId: '4',
    postThumbnail: 'https://picsum.photos/seed/post4/100/100',
    timestamp: '5d',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    isRead: true,
  },
  // Earlier
  {
    id: '7',
    type: 'like',
    actor: { username: 'emma_davis', avatar: 'https://i.pravatar.cc/100?img=7' },
    postId: '5',
    postThumbnail: 'https://picsum.photos/seed/post5/100/100',
    timestamp: '2w',
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    isRead: true,
  },
];

function groupActivityByTime(items: ActivityItemData[]) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

  const groups: { title: string; data: ActivityItemData[] }[] = [];

  const todayItems = items.filter(item => item.createdAt >= today);
  const thisWeekItems = items.filter(item => item.createdAt >= weekAgo && item.createdAt < today);
  const thisMonthItems = items.filter(item => item.createdAt >= monthAgo && item.createdAt < weekAgo);
  const earlierItems = items.filter(item => item.createdAt < monthAgo);

  if (todayItems.length > 0) groups.push({ title: 'Today', data: todayItems });
  if (thisWeekItems.length > 0) groups.push({ title: 'This Week', data: thisWeekItems });
  if (thisMonthItems.length > 0) groups.push({ title: 'This Month', data: thisMonthItems });
  if (earlierItems.length > 0) groups.push({ title: 'Earlier', data: earlierItems });

  return groups;
}

function ActivityHeader() {
  const insets = useSafeAreaInsets();
  const textColor = useThemeColor({}, 'text');

  return (
    <View style={[styles.header, { paddingTop: insets.top }]}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <IconSymbol name="chevron.left" size={24} color={textColor} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Notification</Text>
    </View>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <ThemedView style={styles.sectionHeader}>
      <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
        {title}
      </ThemedText>
    </ThemedView>
  );
}

function EmptyState() {
  const secondaryText = useThemeColor({}, 'secondaryText');

  return (
    <View style={styles.emptyContainer}>
      <IconSymbol name="bell.fill" size={48} color={secondaryText} />
      <ThemedText style={[styles.emptyText, { color: secondaryText }]}>
        No activity yet
      </ThemedText>
      <ThemedText style={[styles.emptySubtext, { color: secondaryText }]}>
        When someone likes or comments on your posts, you'll see it here.
      </ThemedText>
    </View>
  );
}

export default function ActivityScreen() {
  const sections = groupActivityByTime(MOCK_ACTIVITY);

  return (
    <ThemedView style={styles.container}>
      <ActivityHeader />

      {sections.length === 0 ? (
        <EmptyState />
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ActivityItem item={item} />}
          renderSectionHeader={({ section }) => <SectionHeader title={section.title} />}
          showsVerticalScrollIndicator={false}
          stickySectionHeadersEnabled={false}
        />
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
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 12,
  },
  backButton: {
    width: 24,
    height: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'MontserratAlternates_700Bold',
    color: BrandColors.orange[500],
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
});
