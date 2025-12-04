import { useState, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
} from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { BrandColors } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';

interface User {
  id: string;
  username: string;
  role: string;
  avatar: string;
  isVerified: boolean;
}

// Mock users data
const MOCK_USERS: User[] = [
  {
    id: '1',
    username: 'Josh',
    role: 'Junk Removal',
    avatar: 'https://i.pravatar.cc/100?img=1',
    isVerified: false,
  },
  {
    id: '2',
    username: 'stephen',
    role: 'Moving Job',
    avatar: 'https://i.pravatar.cc/100?img=2',
    isVerified: false,
  },
  {
    id: '3',
    username: 'steven_n',
    role: 'Management',
    avatar: 'https://i.pravatar.cc/100?img=3',
    isVerified: true,
  },
  {
    id: '4',
    username: 'toph_sv',
    role: 'Development Team',
    avatar: 'https://i.pravatar.cc/100?img=4',
    isVerified: true,
  },
  {
    id: '5',
    username: 'mike_j',
    role: 'Sales',
    avatar: 'https://i.pravatar.cc/100?img=5',
    isVerified: false,
  },
  {
    id: '6',
    username: 'sarah_k',
    role: 'Marketing',
    avatar: 'https://i.pravatar.cc/100?img=6',
    isVerified: false,
  },
  {
    id: '7',
    username: 'admin_user',
    role: 'Administration',
    avatar: 'https://i.pravatar.cc/100?img=7',
    isVerified: true,
  },
];

interface UserRowProps {
  user: User;
  isTagged: boolean;
  onToggleTag: () => void;
  textColor: string;
  secondaryTextColor: string;
}

function UserRow({ user, isTagged, onToggleTag, textColor, secondaryTextColor }: UserRowProps) {
  return (
    <View style={styles.userRow}>
      <Image source={{ uri: user.avatar }} style={styles.avatar} contentFit="cover" />
      <View style={styles.userInfo}>
        <View style={styles.usernameRow}>
          <Text
            style={[
              styles.username,
              { color: user.isVerified ? BrandColors.green[500] : textColor },
            ]}
          >
            {user.username}
          </Text>
          {user.isVerified && (
            <IconSymbol name="seal-check" size={16} color={BrandColors.green[500]} />
          )}
        </View>
        <Text style={[styles.role, { color: secondaryTextColor }]}>{user.role}</Text>
      </View>
      <TouchableOpacity
        style={[styles.tagButton, isTagged && styles.tagButtonTagged]}
        onPress={onToggleTag}
        activeOpacity={0.7}
      >
        <Text style={[styles.tagButtonText, isTagged && styles.tagButtonTextTagged]}>
          {isTagged ? 'Tagged' : 'Tag'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default function TagUsersScreen() {
  const insets = useSafeAreaInsets();
  const textColor = useThemeColor({}, 'text');
  const secondaryTextColor = useThemeColor({}, 'secondaryText');
  const inputBackgroundColor = useThemeColor({}, 'inputBackground');
  const placeholderColor = useThemeColor({}, 'inputPlaceholder');

  const [searchQuery, setSearchQuery] = useState('');
  const [taggedUsers, setTaggedUsers] = useState<string[]>([]);

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) {
      return MOCK_USERS;
    }
    return MOCK_USERS.filter((user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  function handleBack() {
    router.back();
  }

  function handleDone() {
    console.log('Tagged users:', taggedUsers);
    router.back();
  }

  function toggleTag(userId: string) {
    setTaggedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  }

  function renderUser({ item }: { item: User }) {
    return (
      <UserRow
        user={item}
        isTagged={taggedUsers.includes(item.id)}
        onToggleTag={() => toggleTag(item.id)}
        textColor={textColor}
        secondaryTextColor={secondaryTextColor}
      />
    );
  }

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={24} color={textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: textColor }]}>Tag People</Text>
        <TouchableOpacity onPress={handleDone}>
          <Text style={styles.doneButton}>Done</Text>
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      <View style={styles.searchWrapper}>
        <View style={[styles.searchContainer, { backgroundColor: inputBackgroundColor }]}>
          <IconSymbol name="magnifyingglass" size={20} color={placeholderColor} />
          <TextInput
            style={[styles.searchInput, { color: textColor }]}
            placeholder="Search"
            placeholderTextColor={placeholderColor}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
      </View>

      {/* User List */}
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        renderItem={renderUser}
        contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 20 }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      />
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 24,
    height: 24,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  doneButton: {
    fontSize: 16,
    fontWeight: '600',
    color: BrandColors.orange[500],
  },
  searchWrapper: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    padding: 0,
  },
  listContent: {
    paddingTop: 8,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  avatar: {
    width: 49,
    height: 49,
    borderRadius: 24.5,
    borderWidth: 0.5,
    borderColor: '#dddddd',
    backgroundColor: BrandColors.gray[200],
  },
  userInfo: {
    flex: 1,
    gap: 2,
  },
  usernameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  username: {
    fontSize: 12,
    fontWeight: '700',
  },
  role: {
    fontSize: 12,
  },
  tagButton: {
    backgroundColor: BrandColors.orange[500],
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagButtonTagged: {
    backgroundColor: BrandColors.gray[300],
  },
  tagButtonText: {
    color: BrandColors.base.white,
    fontSize: 12,
    fontWeight: '600',
  },
  tagButtonTextTagged: {
    color: BrandColors.gray[600],
  },
});
