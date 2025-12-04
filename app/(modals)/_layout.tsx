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
        name="post-options"
        options={{
          title: 'Post Options',
          headerShown: false,
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="tag-users"
        options={{
          title: 'Tag People',
          headerShown: false,
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="select-location"
        options={{
          title: 'Select Location',
          headerShown: false,
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="connect-job"
        options={{
          title: 'Connect to a Job',
          headerShown: false,
          presentation: 'card',
        }}
      />
      <Stack.Screen
        name="create-story"
        options={{ title: 'Create Story', headerShown: false }}
      />
    </Stack>
  );
}
