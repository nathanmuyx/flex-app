import { StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Image } from 'expo-image';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const { width, height } = Dimensions.get('window');

export default function StoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <ThemedView style={styles.container}>
      <Image
        source={{ uri: `https://picsum.photos/${width}/${height}` }}
        style={styles.storyImage}
        contentFit="cover"
      />

      <ThemedView style={styles.header}>
        <ThemedView style={styles.userInfo}>
          <Image
            source={{ uri: 'https://picsum.photos/40' }}
            style={styles.avatar}
          />
          <ThemedText style={styles.username}>user_{id}</ThemedText>
          <ThemedText style={styles.time}>2h ago</ThemedText>
        </ThemedView>
        <TouchableOpacity onPress={() => router.back()}>
          <ThemedText style={styles.closeButton}>✕</ThemedText>
        </TouchableOpacity>
      </ThemedView>

      <ThemedView style={styles.progressBar}>
        <ThemedView style={styles.progressFill} />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  storyImage: {
    ...StyleSheet.absoluteFillObject,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 16,
    backgroundColor: 'transparent',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'transparent',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#fff',
  },
  username: {
    color: '#fff',
    fontWeight: '600',
  },
  time: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
  },
  closeButton: {
    color: '#fff',
    fontSize: 24,
  },
  progressBar: {
    position: 'absolute',
    top: 50,
    left: 8,
    right: 8,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 1,
  },
  progressFill: {
    width: '50%',
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 1,
  },
});
