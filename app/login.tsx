import { useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  View,
  Dimensions,
  ScrollView,
  Text,
} from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { TextInput } from '@/components/ui/text-input';
import { useAuth } from '@/contexts/AuthContext';
import { useThemeColor } from '@/hooks/use-theme-color';
import { BrandColors } from '@/constants/theme';

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const tintColor = useThemeColor({}, 'tint');
  const errorColor = useThemeColor({}, 'error');

  async function handleLogin() {
    setError('');

    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (!password) {
      setError('Password is required');
      return;
    }

    setIsLoading(true);
    try {
      await login(email.trim(), password);
      router.replace('/(tabs)');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <ThemedView style={styles.container}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Full-width image covering status bar */}
          <View style={styles.imageContainer}>
            <Image
              source={require('@/assets/images/flex-image-sign-in.png')}
              style={styles.signInImage}
              contentFit="cover"
            />
          </View>

          {/* Form content */}
          <ThemedView style={styles.content}>
            <Text style={styles.title}>
              <Text style={styles.titleBlack}>Welcome to </Text>
              <Text style={styles.titleGreen}>College Hunk </Text>
              <Text style={styles.titleOrange}>Flex</Text>
              <Text style={styles.titleBlack}>!</Text>
            </Text>
            <ThemedText style={styles.subtitle}>
              Sign in to continue
            </ThemedText>

            <ThemedView style={styles.form}>
              <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                hasError={!!error && !email.trim()}
              />

              <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                hasError={!!error && !password}
              />

              {error ? (
                <ThemedText style={[styles.errorText, { color: errorColor }]}>
                  {error}
                </ThemedText>
              ) : null}

              <TouchableOpacity
                style={[styles.button, { backgroundColor: tintColor }]}
                onPress={handleLogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <ThemedText style={styles.buttonText}>Sign In</ThemedText>
                )}
              </TouchableOpacity>
            </ThemedView>
          </ThemedView>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
// Image is 393x390, calculate height to maintain aspect ratio
const IMAGE_ASPECT_RATIO = 390 / 393;
const IMAGE_HEIGHT = SCREEN_WIDTH * IMAGE_ASPECT_RATIO;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  imageContainer: {
    width: SCREEN_WIDTH,
    height: IMAGE_HEIGHT,
  },
  signInImage: {
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  title: {
    fontSize: 21,
    fontWeight: '600',
    textAlign: 'left',
    marginBottom: 8,
  },
  titleBlack: {
    color: BrandColors.base.black,
  },
  titleGreen: {
    color: BrandColors.green[500],
  },
  titleOrange: {
    color: BrandColors.orange[500],
    fontFamily: 'MontserratAlternates_700Bold',
  },
  subtitle: {
    textAlign: 'left',
    opacity: 0.7,
    marginBottom: 32,
  },
  form: {
    gap: 16,
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
  },
  button: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
