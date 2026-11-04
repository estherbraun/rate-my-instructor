// W01 · Welcome — dark spruce, one gold CTA (luxury restraint: one deliberate accent).
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Photo, Txt } from '@/components/ui';
import { useApp } from '@/state/AppState';
import { color, space } from '@/theme/tokens';

export default function Welcome() {
  const insets = useSafeAreaInsets();
  const { dispatch } = useApp();
  return (
    <View style={styles.page}>
      <StatusBar style="light" />
      <Photo tone="spruce" height={360} label="morning light in a quiet studio" style={{ borderRadius: 0 }}>
        <View style={[styles.wordmark, { top: insets.top + 24 }]}>
          <Txt variant="headingXs" tint={color.onDark}>
            rate my instructor
          </Txt>
          <View style={styles.dot} />
        </View>
      </Photo>
      <View style={[styles.body, { paddingBottom: insets.bottom + space.xl }]}>
        <Txt variant="headingXl" tint={color.onDark}>
          Know your instructor before you book.
        </Txt>
        <Txt variant="bodyMd" tint={color.onDarkMuted}>
          Verified ratings for instructors and studios — rated separately, so you always know who made the class.
        </Txt>
        <View style={{ gap: 12, marginTop: space.lg }}>
          <Button kind="gold" label="Create account" onPress={() => router.push('/onboarding/preferences')} />
          <Button kind="onDark" label="Continue with ClassPass" onPress={() => router.push('/onboarding/preferences')} />
          <Pressable
            accessibilityRole="link"
            onPress={() => {
              dispatch({ type: 'completeOnboarding' });
              router.replace('/');
            }}
            style={{ alignSelf: 'center', padding: 8 }}
          >
            <Txt variant="bodySmMedium" tint={color.onDark} underline>
              I already have an account · Log in
            </Txt>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: color.inverse },
  wordmark: { position: 'absolute', left: space.xl, flexDirection: 'row', alignItems: 'center', gap: 4 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: color.highlight, marginTop: 6 },
  body: { flex: 1, paddingHorizontal: space.xl, paddingTop: space.xl, gap: space.lg, justifyContent: 'flex-end' },
});
