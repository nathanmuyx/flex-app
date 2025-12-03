import { Tabs } from 'expo-router';
import React from 'react';
import { View, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol, type IconSymbolName } from '@/components/ui/icon-symbol';
import { BrandColors, Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

function TabIcon({
  name,
  color,
  focused,
  flipHorizontal = false,
  rotateWhenActive = false,
}: {
  name: IconSymbolName;
  color: string;
  focused: boolean;
  flipHorizontal?: boolean;
  rotateWhenActive?: boolean;
}) {
  const getIconStyle = (): StyleProp<ViewStyle> => {
    if (flipHorizontal && rotateWhenActive && focused) {
      return { transform: [{ scaleX: -1 }, { rotate: '26.8deg' }] };
    }
    if (flipHorizontal) {
      return { transform: [{ scaleX: -1 }] };
    }
    if (rotateWhenActive && focused) {
      return { transform: [{ rotate: '26.8deg' }] };
    }
    return undefined;
  };

  return (
    <View style={styles.tabIconContainer}>
      <View style={getIconStyle()}>
        <IconSymbol
          size={28}
          name={name}
          color={color}
          weight={focused ? 'fill' : 'regular'}
        />
      </View>
      {focused && <View style={styles.activeIndicator} />}
    </View>
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: colorScheme === 'dark' ? BrandColors.gray[900] : BrandColors.base.white,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          borderTopWidth: 0,
          paddingTop: 12,
          shadowColor: '#000',
          shadowOffset: { width: 2, height: -3 },
          shadowOpacity: 0.1,
          shadowRadius: 14.4,
          elevation: 10,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="house.fill" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="ig-feed"
        options={{
          title: 'IG Feed',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="instagram-logo" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: 'Create',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="plus.app" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="announcement"
        options={{
          title: 'Alerts',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="megaphone" color={color} focused={focused} flipHorizontal rotateWhenActive />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="person.fill" color={color} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeIndicator: {
    width: 10,
    height: 5,
    borderRadius: 18,
    backgroundColor: BrandColors.orange[500],
    marginTop: 4,
  },
});
