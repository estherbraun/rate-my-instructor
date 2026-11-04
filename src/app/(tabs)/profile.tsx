// W19 · Profile — goals & milestones get the hero spot (self-monitoring = #1 reason to use fitness apps).
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Screen } from '@/components/layout';
import { Avatar, Divider, Icon, Txt, type IconName } from '@/components/ui';
import { useApp } from '@/state/AppState';
import { color, radius, space } from '@/theme/tokens';

export default function Profile() {
  const insets = useSafeAreaInsets();
  const { state } = useApp();
  const { goal, prefs } = state;
  const upcoming = state.bookings.filter((b) => b.status === 'upcoming').length;
  const badges: { icon: IconName; label: string; earned: boolean }[] = [
    { icon: 'star', label: 'First review', earned: state.reviews.length > 0 },
    { icon: 'map-pin', label: '5 studios', earned: false },
    { icon: 'zap', label: '10 classes', earned: goal.done >= 10 },
    { icon: 'award', label: 'Sore club', earned: false },
  ];
  const rows: { icon: IconName; title: string; sub: string; onPress: () => void }[] = [
    { icon: 'calendar', title: 'Upcoming classes', sub: upcoming ? `${upcoming} booked` : 'Nothing booked yet', onPress: () => router.navigate('/rate') },
    { icon: 'star', title: 'My reviews', sub: `${state.reviews.length} verified`, onPress: () => router.navigate('/rate') },
    { icon: 'sliders', title: 'Coaching & class preferences', sub: `${prefs.likedCoaching.join(' · ')} · ${prefs.timeWindows.join(', ')} · ${prefs.maxDistanceMi} mi`, onPress: () => router.push('/onboarding/preferences?mode=edit') },
    { icon: 'users', title: 'Friends', sub: `${state.syncedFriends.length} synced`, onPress: () => router.push('/onboarding/friends?mode=edit') },
  ];

  return (
    <Screen padded={false} topInset={false}>
      <StatusBar style="light" />
      <View style={[styles.hero, { paddingTop: insets.top + space.xl }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <Avatar initials="MR" tone="gold" size={72} />
          <View>
            <Txt variant="headingSm" tint={color.onDark}>
              Maya Reyes
            </Txt>
            <Txt variant="bodySm" tint={color.onDarkMuted}>
              {goal.done} classes · {state.reviews.length} reviews
            </Txt>
          </View>
        </View>
        <View style={styles.goal}>
          <Txt variant="eyebrow" tint={color.onDarkMuted}>
            Goals & milestones
          </Txt>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Txt variant="bodyMdMedium" tint={color.onDark}>
              {goal.target} classes in November
            </Txt>
            <Txt variant="bodySmMedium" tint={color.gold}>
              {goal.done}/{goal.target}
            </Txt>
          </View>
          <View style={styles.track}>
            <View style={[styles.fill, { width: `${(goal.done / goal.target) * 100}%` }]} />
          </View>
        </View>
      </View>

      <View style={{ paddingHorizontal: space.xl, paddingTop: space.xl }}>
        <Txt variant="headingXs">Badges</Txt>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: space.lg }}>
          {badges.map((b) => (
            <View key={b.label} style={{ alignItems: 'center', gap: 6, width: 76 }} accessibilityLabel={`${b.label}${b.earned ? ', earned' : ''}`}>
              <View style={[styles.badge, { backgroundColor: b.earned ? color.goldTint : color.subtle }]}>
                <Icon name={b.icon} size={26} tint={b.earned ? color.goldDeep : color.textMuted} />
              </View>
              <Txt variant="bodyXsMedium" tint={color.textSecondary} center>
                {b.label}
              </Txt>
            </View>
          ))}
        </View>

        <View style={{ marginTop: space.xl }}>
          {rows.map((r, idx) => (
            <View key={r.title}>
              <Pressable accessibilityRole="button" onPress={r.onPress} style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14 }}>
                <Icon name={r.icon} tint={color.primary} />
                <View style={{ flex: 1 }}>
                  <Txt variant="bodyMdMedium">{r.title}</Txt>
                  <Txt variant="bodyXs" tint={color.textSecondary} numberOfLines={1}>
                    {r.sub}
                  </Txt>
                </View>
                <Icon name="chevron-right" size={20} tint={color.textMuted} />
              </Pressable>
              {idx < rows.length - 1 ? <Divider inset={38} /> : null}
            </View>
          ))}
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { backgroundColor: color.inverse, paddingHorizontal: space.xl, paddingBottom: space.xl, gap: space.xl },
  goal: { backgroundColor: color.inverseRaised, borderRadius: radius.default, padding: space.lg, gap: 6 },
  track: { height: 4, borderRadius: radius.pill, backgroundColor: color.inverse, marginTop: 4 },
  fill: { height: 4, borderRadius: radius.pill, backgroundColor: color.gold },
  badge: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
});
