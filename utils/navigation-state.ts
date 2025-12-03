import type { Href } from 'expo-router';

// Track the last active tab before opening Create flow
let previousTab: Href = '/(tabs)';

export function setPreviousTab(tab: Href) {
  previousTab = tab;
}

export function getPreviousTab(): Href {
  return previousTab;
}
