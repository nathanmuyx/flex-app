import {
  StyleSheet,
  View,
  ActivityIndicator,
  FlatList,
  useWindowDimensions,
} from 'react-native';
import { useState, useCallback } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

import { setPreviousTab } from '@/utils/navigation-state';
import { WebView } from 'react-native-webview';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';
import { BrandColors } from '@/constants/theme';
import { INSTAGRAM_CONFIG } from '@/constants/instagram-config';


function FeedHeader() {
  const insets = useSafeAreaInsets();

  return (
    <ThemedView style={[styles.headerContainer, { paddingTop: insets.top }]}>
      <View style={styles.headerContent}>
        <IconSymbol name="instagram-logo" size={32} color="#E1306C" weight="fill" />
      </View>
    </ThemedView>
  );
}

function InstagramEmbedCard({ postId }: { postId: string }) {
  const [isLoading, setIsLoading] = useState(true);
  const backgroundColor = useThemeColor({}, 'background');
  const { width: screenWidth } = useWindowDimensions();

  const embedHeight = screenWidth + 120; // Square image + caption space

  // HTML with mobile viewport to force mobile rendering
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=${screenWidth}, initial-scale=1, maximum-scale=1, user-scalable=no">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body {
      width: ${screenWidth}px;
      overflow: hidden;
      background: transparent;
    }
    iframe {
      width: ${screenWidth}px !important;
      border: none !important;
    }
  </style>
</head>
<body>
  <iframe
    src="https://www.instagram.com/p/${postId}/embed/"
    width="${screenWidth}"
    height="${embedHeight}"
    frameborder="0"
    scrolling="no"
    allowtransparency="true">
  </iframe>
</body>
</html>
  `;

  return (
    <View style={[styles.embedCard, { backgroundColor, height: embedHeight }]}>
      {isLoading && (
        <View style={styles.cardLoadingOverlay}>
          <ActivityIndicator size="small" color={BrandColors.orange[500]} />
        </View>
      )}
      <WebView
        source={{ html, baseUrl: 'https://www.instagram.com' }}
        style={styles.embedWebView}
        onLoadEnd={() => setIsLoading(false)}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        originWhitelist={['*']}
      />
    </View>
  );
}

function EmptyState() {
  const secondaryText = useThemeColor({}, 'secondaryText');

  return (
    <View style={styles.emptyState}>
      <IconSymbol name="instagram-logo" size={64} color={secondaryText} />
      <ThemedText style={[styles.emptyTitle, { color: secondaryText }]}>No Posts Added</ThemedText>
      <ThemedText style={[styles.emptySubtitle, { color: secondaryText }]}>
        Add Instagram post IDs to{'\n'}constants/instagram-config.ts
      </ThemedText>
    </View>
  );
}

export default function IGFeedScreen() {
  const [refreshKey, setRefreshKey] = useState(0);
  const backgroundColor = useThemeColor({}, 'background');

  // Track this tab as the previous tab for back navigation
  useFocusEffect(
    useCallback(() => {
      setPreviousTab('/(tabs)/ig-feed');
    }, [])
  );

  const onRefresh = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  if (INSTAGRAM_CONFIG.posts.length === 0) {
    return (
      <ThemedView style={styles.container}>
        <FeedHeader />
        <EmptyState />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <FeedHeader />
      <FlatList
        key={refreshKey}
        data={INSTAGRAM_CONFIG.posts}
        keyExtractor={(item) => item}
        renderItem={({ item }) => <InstagramEmbedCard postId={item} />}
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor }}
        contentContainerStyle={styles.feedContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
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
    paddingBottom: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  feedContent: {
    paddingBottom: TAB_BAR_HEIGHT,
  },
  embedCard: {
    width: '100%',
    overflow: 'hidden',
    position: 'relative',
  },
  embedWebView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  cardLoadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  separator: {
    height: 0,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
