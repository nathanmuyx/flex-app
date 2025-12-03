import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { BrandColors } from '@/constants/theme';

export type ContentType = 'post' | 'story';

interface ContentTypeTabsProps {
  activeTab: ContentType;
  onTabChange: (tab: ContentType) => void;
}

export function ContentTypeTabs({ activeTab, onTabChange }: ContentTypeTabsProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'post' && styles.activeTab]}
        onPress={() => onTabChange('post')}
        activeOpacity={0.7}
      >
        <Text style={[styles.tabText, activeTab === 'post' && styles.activeTabText]}>
          Post
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'story' && styles.activeTab]}
        onPress={() => onTabChange('story')}
        activeOpacity={0.7}
      >
        <Text style={[styles.tabText, activeTab === 'story' && styles.activeTabText]}>
          Story
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: BrandColors.gray[50],
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BrandColors.gray[200],
    padding: 4,
    gap: 4,
  },
  tab: {
    flex: 1,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  activeTab: {
    backgroundColor: BrandColors.orange[500],
    shadowColor: '#0A0D12',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: BrandColors.gray[500],
  },
  activeTabText: {
    color: BrandColors.gray[25],
  },
});
