import { StyleSheet, ScrollView, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function PostScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const borderColor = useThemeColor({}, 'inputBorder');

  // Mock data - in real app, fetch from Xano
  const post = {
    id,
    username: 'john_doe',
    avatar: 'https://picsum.photos/50',
    image: 'https://picsum.photos/400/400',
    likes: 124,
    caption: 'Beautiful day! The weather is perfect for a walk in the park.',
    comments: [
      { id: '1', username: 'jane_smith', text: 'Amazing!' },
      { id: '2', username: 'mike_wilson', text: 'Love this!' },
      { id: '3', username: 'sarah_jones', text: 'Where is this?' },
    ],
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView>
        <View style={styles.postHeader}>
          <Image source={{ uri: post.avatar }} style={styles.avatar} />
          <ThemedText type="defaultSemiBold">{post.username}</ThemedText>
        </View>

        <Image source={{ uri: post.image }} style={styles.postImage} />

        <View style={styles.postActions}>
          <ThemedText style={styles.actionIcon}>♡</ThemedText>
          <ThemedText style={styles.actionIcon}>💬</ThemedText>
          <ThemedText style={styles.actionIcon}>➤</ThemedText>
        </View>

        <View style={styles.postContent}>
          <ThemedText type="defaultSemiBold">{post.likes} likes</ThemedText>
          <ThemedText>
            <ThemedText type="defaultSemiBold">{post.username}</ThemedText>{' '}
            {post.caption}
          </ThemedText>
        </View>

        <View style={[styles.commentsSection, { borderTopColor: borderColor }]}>
          <ThemedText type="subtitle" style={styles.commentsTitle}>
            Comments
          </ThemedText>
          {post.comments.map((comment) => (
            <View key={comment.id} style={styles.comment}>
              <ThemedText>
                <ThemedText type="defaultSemiBold">{comment.username}</ThemedText>{' '}
                {comment.text}
              </ThemedText>
            </View>
          ))}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  postImage: {
    width: '100%',
    aspectRatio: 1,
  },
  postActions: {
    flexDirection: 'row',
    padding: 12,
    gap: 16,
  },
  actionIcon: {
    fontSize: 24,
  },
  postContent: {
    paddingHorizontal: 12,
    gap: 4,
  },
  commentsSection: {
    marginTop: 16,
    paddingTop: 16,
    paddingHorizontal: 12,
    borderTopWidth: 1,
  },
  commentsTitle: {
    marginBottom: 12,
  },
  comment: {
    paddingVertical: 8,
  },
});
