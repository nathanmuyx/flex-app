import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { EmojiReactions, type EmojiReaction } from './emoji-reactions';
import { useThemeColor } from '@/hooks/use-theme-color';
import { BrandColors } from '@/constants/theme';

const ANNOUNCEMENT_GRADIENT = ['#226937', '#0E864D'] as const;

export type UserRole = 'member' | 'admin';

export interface PostData {
  id: string;
  user: {
    username: string;
    avatar: string;
    role: UserRole;
  };
  image: string;
  caption: string;
  reactions: EmojiReaction[];
  commentsCount: number;
  timeAgo: string;
  isAnnouncement: boolean;
}

interface PostCardProps {
  post: PostData;
  onPress?: () => void;
  onUserPress?: () => void;
  onCommentPress?: () => void;
  onReactionPress?: (emoji: string) => void;
  onAddReaction?: () => void;
  hideAnnouncementStyle?: boolean;
}

export function PostCard({
  post,
  onPress,
  onUserPress,
  onCommentPress,
  onReactionPress,
  onAddReaction,
  hideAnnouncementStyle = false,
}: PostCardProps) {
  const separatorColor = useThemeColor({}, 'separator');
  const iconColor = useThemeColor({}, 'icon');
  const secondaryText = useThemeColor({}, 'secondaryText');
  const textColor = useThemeColor({}, 'text');

  const isAdmin = post.user.role === 'admin';
  const isAnnouncement = post.isAnnouncement && !hideAnnouncementStyle;

  // Colors based on announcement state
  const contentColor = isAnnouncement ? '#FFFFFF' : textColor;
  const secondaryColor = isAnnouncement ? 'rgba(255,255,255,0.7)' : secondaryText;
  const currentIconColor = isAnnouncement ? '#FFFFFF' : iconColor;

  // Show badge even when gradient is hidden
  const showAnnouncementBadge = post.isAnnouncement;

  const content = (
    <>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.userInfo} onPress={onUserPress} activeOpacity={0.7}>
          <Image source={{ uri: post.user.avatar }} style={styles.avatar} />
          <View style={styles.userDetails}>
            <View style={styles.usernameContainer}>
              <Text style={[styles.username, { color: isAnnouncement ? '#FFFFFF' : (isAdmin ? BrandColors.green[500] : textColor) }]}>
                {post.user.username}
              </Text>
              {isAdmin && (
                <IconSymbol
                  name="seal-check"
                  size={16}
                  color={isAnnouncement ? '#FFFFFF' : BrandColors.green[500]}
                  weight="fill"
                />
              )}
            </View>
            <Text style={[styles.headerTimeAgo, { color: secondaryColor }]}>
              {post.timeAgo}
            </Text>
          </View>
        </TouchableOpacity>
        <View style={styles.headerRight}>
          {showAnnouncementBadge && (
            <View style={[styles.announcementBadge, !isAnnouncement && styles.announcementBadgeAlt]}>
              <Text style={[styles.announcementBadgeText, !isAnnouncement && styles.announcementBadgeTextAlt]}>Announcement</Text>
            </View>
          )}
          <TouchableOpacity style={styles.menuButton}>
            <IconSymbol name="dots-three" size={24} color={currentIconColor} weight="bold" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Caption - Now above image */}
      <View style={styles.captionContainer}>
        <Text style={[styles.caption, { color: contentColor }]}>
          {post.caption}
        </Text>
      </View>

      {/* Image - All posts now have padding and rounded corners */}
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.95}
        style={styles.imageContainer}
      >
        <Image
          source={{ uri: post.image }}
          style={styles.postImage}
          contentFit="cover"
        />
      </TouchableOpacity>

      {/* Reactions Row */}
      <View style={styles.reactionsRow}>
        <View style={styles.reactionsLeft}>
          <EmojiReactions
            reactions={post.reactions}
            onReactionPress={onReactionPress}
            onAddReaction={onAddReaction}
          />
        </View>
        <View style={styles.actionsRight}>
          <TouchableOpacity onPress={onCommentPress} style={styles.actionButton}>
            <IconSymbol name="chat" size={24} color={currentIconColor} weight="regular" />
            {post.commentsCount > 0 && (
              <Text style={[styles.commentCount, { color: secondaryColor }]}>
                {post.commentsCount}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* View Comments Link */}
      {post.commentsCount > 0 && (
        <TouchableOpacity onPress={onCommentPress} style={styles.viewComments}>
          <Text style={[styles.viewCommentsText, { color: secondaryColor }]}>
            View all {post.commentsCount} comments
          </Text>
        </TouchableOpacity>
      )}
    </>
  );

  if (isAnnouncement) {
    return (
      <LinearGradient
        colors={ANNOUNCEMENT_GRADIENT}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.container, styles.announcementContainer]}
      >
        {content}
      </LinearGradient>
    );
  }

  return (
    <ThemedView style={[styles.container, { borderBottomColor: separatorColor }]}>
      {content}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 0.5,
    paddingBottom: 16,
    marginBottom: 8,
  },
  announcementContainer: {
    borderBottomWidth: 0,
    borderRadius: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  announcementBadge: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  announcementBadgeAlt: {
    backgroundColor: BrandColors.green[500],
  },
  announcementBadgeText: {
    color: BrandColors.green[500],
    fontSize: 10,
    fontWeight: '700',
  },
  announcementBadgeTextAlt: {
    color: '#FFFFFF',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  userDetails: {
    flexDirection: 'column',
  },
  usernameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  headerTimeAgo: {
    fontSize: 11,
    marginTop: 1,
  },
  username: {
    fontSize: 14,
    fontWeight: '600',
  },
  adminUsername: {
    color: BrandColors.green[500],
  },
  menuButton: {
    padding: 4,
  },
  imageContainer: {
    paddingHorizontal: 16,
  },
  postImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
  },
  reactionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  reactionsLeft: {
    flex: 1,
  },
  actionsRight: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 16,
    gap: 14,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  commentCount: {
    fontSize: 13,
    fontWeight: '500',
  },
  captionContainer: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  caption: {
    fontSize: 14,
    lineHeight: 20,
  },
  viewComments: {
    paddingHorizontal: 16,
    marginTop: 6,
  },
  viewCommentsText: {
    fontSize: 14,
  },
});
