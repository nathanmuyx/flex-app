import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { BrandColors } from '@/constants/theme';

export type NotificationType = 'like' | 'comment' | 'mention' | 'follow';

export interface ActivityItemData {
  id: string;
  type: NotificationType;
  actor: {
    username: string;
    avatar: string;
  };
  postId?: string;
  postThumbnail?: string;
  content?: string;
  timestamp: string;
  createdAt: Date;
  isRead: boolean;
}

interface ActivityItemProps {
  item: ActivityItemData;
}

function getActionText(type: NotificationType, content?: string): string {
  switch (type) {
    case 'like':
      return 'liked your post.';
    case 'comment':
      return content ? `commented: "${content}"` : 'commented on your post.';
    case 'mention':
      return 'mentioned you in a comment.';
    case 'follow':
      return 'started following you.';
    default:
      return '';
  }
}

export function ActivityItem({ item }: ActivityItemProps) {
  const secondaryText = useThemeColor({}, 'secondaryText');
  const backgroundColor = useThemeColor({}, 'background');

  function handlePress() {
    if (item.postId) {
      router.push(`/post/${item.postId}`);
    }
  }

  return (
    <TouchableOpacity
      style={[styles.container, !item.isRead && styles.unread]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {/* Avatar */}
      <Image
        source={{ uri: item.actor.avatar }}
        style={styles.avatar}
        contentFit="cover"
      />

      {/* Text Content */}
      <View style={styles.textContainer}>
        <ThemedText style={styles.text} numberOfLines={2}>
          <ThemedText style={styles.username}>{item.actor.username}</ThemedText>
          {' '}
          {getActionText(item.type, item.content)}
          {' '}
          <ThemedText style={[styles.timestamp, { color: secondaryText }]}>
            {item.timestamp}
          </ThemedText>
        </ThemedText>
      </View>

      {/* Post Thumbnail */}
      {item.postThumbnail && (
        <Image
          source={{ uri: item.postThumbnail }}
          style={styles.thumbnail}
          contentFit="cover"
        />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  unread: {
    backgroundColor: BrandColors.orange[25],
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: BrandColors.gray[200],
  },
  textContainer: {
    flex: 1,
  },
  text: {
    fontSize: 14,
    lineHeight: 18,
  },
  username: {
    fontWeight: '600',
  },
  timestamp: {
    fontSize: 14,
  },
  thumbnail: {
    width: 44,
    height: 44,
    borderRadius: 4,
    backgroundColor: BrandColors.gray[200],
  },
});
