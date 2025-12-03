import { useCallback } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

import { ThemedText } from '@/components/themed-text';
import { setPreviousTab } from '@/utils/navigation-state';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/contexts/AuthContext';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const tintColor = useThemeColor({}, 'tint');

  // Track this tab as the previous tab for back navigation
  useFocusEffect(
    useCallback(() => {
      setPreviousTab('/(tabs)/profile');
    }, [])
  );

  async function handleLogout() {
    await logout();
    router.replace('/login');
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Profile</ThemedText>

      {user && (
        <ThemedView style={styles.info}>
          <ThemedText type="defaultSemiBold">{user.email}</ThemedText>
          {user.name && <ThemedText>{user.name}</ThemedText>}
          {user.role && (
            <ThemedText style={styles.role}>Role: {user.role}</ThemedText>
          )}
        </ThemedView>
      )}

      <TouchableOpacity
        style={[styles.logoutButton, { backgroundColor: tintColor }]}
        onPress={handleLogout}
      >
        <ThemedText style={styles.logoutText}>Log Out</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 20,
  },
  info: {
    alignItems: 'center',
    gap: 4,
  },
  role: {
    opacity: 0.7,
    fontSize: 14,
  },
  logoutButton: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  logoutText: {
    color: '#fff',
    fontWeight: '600',
  },
});
