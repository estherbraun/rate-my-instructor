// W02 · Set preferences — pre-sets filters (time + distance) and the coaching-style match.
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { BackHeader, Screen, StepProgress } from '@/components/layout';
import { Button, ChipGroup, Txt } from '@/components/ui';
import { DEALBREAKER_TAGS, POSITIVE_TAGS, type Format, type Preferences, type TimeWindow } from '@/data/types';
import { DISTANCE_STEPS, TIME_WINDOWS } from '@/lib/logic';
import { useApp } from '@/state/AppState';
import { color, radius, space } from '@/theme/tokens';

const FORMATS: Format[] = ['Yoga', 'HIIT', 'Pilates', 'Cycle', 'Barre', 'Hot yoga'];
const toggle = <T,>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

export default function PreferencesScreen() {
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const editing = mode === 'edit';
  const { state, dispatch } = useApp();
  const [p, setP] = useState<Preferences>(state.prefs);

  const save = () => {
    dispatch({ type: 'setPrefs', prefs: p });
    if (editing) router.back();
    else router.push('/onboarding/friends');
  };

  return (
    <Screen footer={<Button label={editing ? 'Save preferences' : 'Continue'} onPress={save} />}>
      <BackHeader eyebrow={editing ? 'Profile' : 'Step 1 of 2'} />
      {!editing ? <StepProgress step={1} total={2} /> : null}
      <View style={{ gap: 4, marginTop: space.xl }}>
        <Txt variant="headingMd">Tailor your classes</Txt>
        <Txt variant="bodySm" tint={color.textSecondary}>
          We use this to pre-set filters and match you with instructors.
        </Txt>
      </View>

      <Section title="When do you usually go?">
        <ChipGroup<TimeWindow> options={TIME_WINDOWS} selected={p.timeWindows} onToggle={(v) => setP({ ...p, timeWindows: toggle(p.timeWindows, v) })} />
      </Section>

      <Section title={`How far will you travel? · ${p.maxDistanceMi} mi`}>
        <View style={styles.distance} accessibilityRole="adjustable" accessibilityLabel={`Maximum distance ${p.maxDistanceMi} miles`}>
          {DISTANCE_STEPS.map((d) => {
            const on = d <= p.maxDistanceMi;
            return (
              <Pressable key={d} onPress={() => setP({ ...p, maxDistanceMi: d })} style={styles.stop} accessibilityLabel={`${d} miles`}>
                <View style={[styles.stopBar, on && { backgroundColor: color.primary }]} />
                <Txt variant="bodyXs" tint={d === p.maxDistanceMi ? color.primary : color.textMuted}>
                  {d}
                </Txt>
              </Pressable>
            );
          })}
        </View>
      </Section>

      <Section title="Classes you love">
        <ChipGroup<Format> options={FORMATS} selected={p.formats} onToggle={(v) => setP({ ...p, formats: toggle(p.formats, v) })} />
      </Section>

      <Section title="Coaching that motivates you">
        <ChipGroup options={POSITIVE_TAGS} selected={p.likedCoaching} onToggle={(v) => setP({ ...p, likedCoaching: toggle(p.likedCoaching, v) })} />
      </Section>

      <Section title="Dealbreakers">
        <ChipGroup options={DEALBREAKER_TAGS} selected={p.dealbreakers} selectedKind="dark" onToggle={(v) => setP({ ...p, dealbreakers: toggle(p.dealbreakers, v) })} />
      </Section>
    </Screen>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ marginTop: space.xl, gap: 12 }}>
      <Txt variant="bodySmMedium">{title}</Txt>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  distance: { flexDirection: 'row', gap: 6 },
  stop: { flex: 1, gap: 6, alignItems: 'center' },
  stopBar: { height: 6, alignSelf: 'stretch', borderRadius: radius.pill, backgroundColor: color.subtle },
});
