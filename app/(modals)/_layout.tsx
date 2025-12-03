import { Stack } from 'expo-router';

export default function ModalsLayout() {
  return (
    <Stack screenOptions={{ presentation: 'modal' }}>
      <Stack.Screen
        name="select-photos"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="create-post"
        options={{ title: 'Create Post', headerShown: false }}
      />
      <Stack.Screen
        name="create-story"
        options={{ title: 'Create Story', headerShown: false }}
      />
    </Stack>
  );
}
