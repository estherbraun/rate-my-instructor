// W04 · Home — from the paper sketch: search + location, favorites, map of tried studios,
// add rating, want to try, goal, go with friends. W14 (post-class prompt) appears as a banner.
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Screen } from '@/components/layout';
import { Avatar, Button, Icon, Photo, SectionHeader, Txt, StarIcon } from '@/components/ui';
import { byId, friends, studios } from '@/data/mock';
import { useApp, usePendingReview } from '@/state/AppState';
import { color, radius, space } from '@/theme/tokens';

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
}

// Rough map positions (percent) for the stylized map.
const PIN_POS: Record<string, { left: `${number}%`; top: `${number}%` }> = {
  form: { left: '18%', top: '22%' },
  'light-theory': { left: '50%', top: '52%' },
  pulse: { left: '78%', top: '16%' },
  'core-house': { left: '62%', top: '70%' },
};

export default function Home() {
  const { state } = useApp();
  const pending = usePendingReview();
  const [snoozed, setSnoozed] = useState<string | null>(null);
  const pendingClass = pending && pending.id !== snoozed ? byId.class(pending.classId) : undefined;
  const wantToTry = [
    ...state.saved.classes.map((id) => ({ id, kind: 'class' as const, item: byId.class(id) })),
    ...state.saved.studios.map((id) => ({ id, kind: 'studio' as const, item: byId.studio(id) })),
  ].filter((x) => x.item);

  return (
    <Screen>
      <View style={styles.headerRow}>
        <View>
          <Txt variant="eyebrow" tint={color.textMuted}>
            {greeting()}
          </Txt>
          <Txt variant="headingMd">Maya</Txt>
        </View>
        <View style={[styles.row, { gap: 14 }]}>
          <Icon name="bell" />
          <Pressable accessibilityRole="button" accessibilityLabel="Profile" onPress={() => router.navigate('/profile')}>
            <Avatar initials="MR" tone="gold" size={40} />
          </Pressable>
        </View>
      </View>

      {pendingClass ? (
        <View style={styles.prompt} accessibilityRole="alert">
          <Txt variant="eyebrow" tint={color.onDarkMuted}>
            Just finished
          </Txt>
          <Txt variant="bodyMdMedium" tint={color.onDark}>
            How was {pendingClass.title} with {byId.instructor(pendingClass.instructorId)?.name.split(' ')[0]}?
          </Txt>
          <Txt variant="bodySm" tint={color.onDarkMuted}>
            30 seconds. Instructor and studio are rated separately.
          </Txt>
          <View style={[styles.row, { gap: 10, marginTop: 6 }]}>
            <Button kind="gold" size="sm" label="Rate now" onPress={() => router.navigate({ pathname: '/rate/instructor', params: { bookingId: pending!.id } })} />
            <Button kind="onDark" size="sm" label="Tomorrow" onPress={() => setSnoozed(pending!.id)} />
          </View>
        </View>
      ) : null}

      <Pressable accessibilityRole="search" onPress={() => router.navigate('/explore')} style={styles.search}>
        <Icon name="search" size={20} tint={color.textMuted} />
        <Txt variant="bodySm" tint={color.textMuted} style={{ flex: 1 }}>
          Search a studio or instructor
        </Txt>
        <View style={styles.location}>
          <Icon name="map-pin" size={14} tint={color.primary} />
          <Txt variant="bodyXsMedium">Back Bay</Txt>
        </View>
      </Pressable>

      <View style={[styles.row, { gap: 10, marginTop: space.md }]}>
        {['Fav studios', 'Fav instructors'].map((l) => (
          <Pressable key={l} accessibilityRole="button" onPress={() => router.navigate('/saved')} style={styles.pill}>
            <Icon name="heart" size={18} tint={color.goldDeep} />
            <Txt variant="bodySmMedium">{l}</Txt>
          </Pressable>
        ))}
      </View>

      <View style={styles.map} accessibilityLabel="Map of studios you've tried">
        <View style={[styles.road, { top: '30%', transform: [{ rotate: '-8deg' }] }]} />
        <View style={[styles.road, { top: '68%', transform: [{ rotate: '6deg' }] }]} />
        <View style={[styles.roadV, { left: '35%' }]} />
        <View style={[styles.roadV, { left: '72%' }]} />
        <View style={styles.mapLabel}>
          <Txt variant="bodyXsMedium">Studios you tried</Txt>
        </View>
        {studios.map((s) => (
          <Pressable key={s.id} accessibilityRole="button" accessibilityLabel={`${s.name}, rated ${s.ratings.cleanliness}`} onPress={() => router.push(`/explore/studio/${s.id}`)} style={[styles.pin, PIN_POS[s.id]]}>
            <StarIcon size={12} />
            <Txt variant="bodyXsMedium" tint={color.onDark}>
              {s.ratings.cleanliness.toFixed(1)}
            </Txt>
          </Pressable>
        ))}
      </View>

      <Button label="Add a rating" icon="plus" onPress={() => router.navigate('/rate')} style={{ marginTop: space.lg }} />

      <View style={{ marginTop: space.xl, gap: 12 }}>
        <SectionHeader title="Want to try" action="See all" onAction={() => router.navigate('/saved')} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
          {wantToTry.map(({ id, kind, item }) => (
            <Pressable key={id} accessibilityRole="button" onPress={() => router.push(kind === 'class' ? `/explore/class/${id}` : `/explore/studio/${id}`)} style={{ width: 140, gap: 4 }}>
              <Photo tone={item!.tone} height={84} />
              <Txt variant="bodySmMedium" numberOfLines={1}>
                {'title' in item! ? item.title : item!.name}
              </Txt>
              <Txt variant="bodyXs" tint={color.textSecondary}>
                {kind === 'class' ? 'Class' : 'Studio'}
              </Txt>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <Pressable accessibilityRole="button" onPress={() => router.navigate('/profile')} style={styles.goal}>
        <View style={{ flex: 1, gap: 4 }}>
          <Txt variant="eyebrow" tint={color.onDarkMuted}>
            {state.goal.label}
          </Txt>
          <Txt variant="bodyMdMedium" tint={color.onDark}>
            {state.goal.done} of {state.goal.target} classes
          </Txt>
          <View style={styles.track}>
            <View style={[styles.fill, { width: `${(state.goal.done / state.goal.target) * 100}%` }]} />
          </View>
        </View>
        <Icon name="award" size={26} tint={color.gold} />
      </Pressable>

      <View style={[styles.row, { gap: 12, marginTop: space.lg }]}>
        <Txt variant="bodySmMedium" tint={color.textSecondary}>
          Go with
        </Txt>
        <Pressable accessibilityRole="button" accessibilityLabel="Friends" onPress={() => router.push('/onboarding/friends?mode=edit')} style={styles.row}>
          {friends.map((f, i) => (
              <View key={f.id} style={{ marginLeft: i ? -8 : 0 }}>
                <Avatar initials={f.initials} tone={i % 2 ? 'gold' : 'spruce'} size={34} />
              </View>
          ))}
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: space.lg },
  prompt: { backgroundColor: color.inverse, borderRadius: radius.default, padding: space.lg, gap: 4, marginBottom: space.lg },
  search: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: color.subtle, borderRadius: radius.default, paddingLeft: 14, paddingRight: 8, height: 48 },
  location: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: color.canvas, borderRadius: radius.pill, borderWidth: 1, borderColor: color.border, paddingHorizontal: 10, paddingVertical: 5 },
  pill: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderColor: color.borderStrong, borderRadius: radius.pill, paddingHorizontal: 14, height: 40 },
  map: { height: 150, backgroundColor: color.tint, borderRadius: radius.default, marginTop: space.md, overflow: 'hidden' },
  road: { position: 'absolute', left: -20, right: -20, height: 10, backgroundColor: color.canvas },
  roadV: { position: 'absolute', top: -10, bottom: -10, width: 10, backgroundColor: color.canvas },
  mapLabel: { position: 'absolute', left: 10, top: 10, backgroundColor: color.canvas, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 2 },
  pin: { position: 'absolute', flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: color.primary, borderRadius: radius.pill, paddingHorizontal: 8, paddingVertical: 3 },
  goal: { flexDirection: 'row', alignItems: 'center', gap: space.lg, backgroundColor: color.inverse, borderRadius: radius.default, padding: space.lg, marginTop: space.xl },
  track: { height: 4, borderRadius: radius.pill, backgroundColor: color.inverseRaised, marginTop: 6 },
  fill: { height: 4, borderRadius: radius.pill, backgroundColor: color.gold },
});
