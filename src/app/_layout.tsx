import { RedHatDisplay_300Light, RedHatDisplay_400Regular, RedHatDisplay_500Medium } from '@expo-google-fonts/red-hat-display';
import { RedHatText_400Regular, RedHatText_500Medium } from '@expo-google-fonts/red-hat-text';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { AppStateProvider } from '@/state/AppState';
import { color } from '@/theme/tokens';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    RedHatDisplay_300Light,
    RedHatDisplay_400Regular,
    RedHatDisplay_500Medium,
    RedHatText_400Regular,
    RedHatText_500Medium,
    ...Feather.font,
    ...Ionicons.font,
  });

  useEffect(() => {
    if (loaded || error) SplashScreen.hideAsync();
  }, [loaded, error]);

  if (!loaded && !error) return null;

  return (
    <AppStateProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: color.canvas } }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="welcome" options={{ animation: 'fade' }} />
        <Stack.Screen name="onboarding/preferences" />
        <Stack.Screen name="onboarding/friends" />
      </Stack>
    </AppStateProvider>
  );
}
