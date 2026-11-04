// W11 · Instructor profile (shared view) — verified coaching-style tags, music, ratings.
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Screen } from '@/components/layout';
import { Avatar, Badge, Button, Divider, Icon, IconButton, RatingBar, Tag, Txt } from '@/components/ui';
import { byId, classes } from '@/data/mock';
import { formatTime, matchScore } from '@/lib/logic';
import { useApp } from '@/state/AppState';
import { color, radius, space } from '@/theme/tokens';

export default function InstructorProfile() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { state, dispatch } = useApp();
  const i = byId.instructor(id);
  if (!i) return null;
  const following = state.following.includes(i.id);
  const upcoming = classes.filter((c) => c.instructorId === i.id).sort((a, b) => a.start - b.start);
  const tags = [...i.coaching].sort((a, b) => b.count - a.count);

  return (
    <Screen padded={false} topInset={false}>
      <StatusBar style="light" />
      <View style={[styles.hero, { paddingTop: insets.top + 8 }]}>
        <View style={[styles.row, { justifyContent: 'space-between' }]}>
          <IconButton name="chevron-left" label="Back" dark onPress={() => router.back()} />
          <IconButton name="share" label="Share instructor" dark />
        </View>
        <View style={[styles.row, { gap: 16, marginTop: space.lg }]}>
          <Avatar initials={i.initials} tone={i.tone} size={84} />
          <View style={{ flex: 1, gap: 4 }}>
            <Txt variant="headingSm" tint={color.onDark}>
              {i.name}
            </Txt>
            <Txt variant="bodySm" tint={color.onDarkMuted}>
              {i.disciplines.join(' · ')} · {i.studioIds.length} studios
            </Txt>
            <View style={[styles.row, { gap: 8, marginTop: 4 }]}>
              <View style={styles.matchPill}>
                <Txt variant="bodyXsMedium">{matchScore(i, state.prefs)}% match</Txt>
              </View>
              <Pressable accessibilityRole="button" onPress={() => dispatch({ type: 'toggleFollow', id: i.id })} style={[styles.followPill, following && { backgroundColor: color.onDark }]}>
                <Txt variant="bodyXsMedium" tint={following ? color.primary : color.onDark}>
                  {following ? 'Following' : '+ Follow'}
                </Txt>
              </Pressable>
            </View>
          </View>
        </View>
        <View style={[styles.row, { gap: 8, marginTop: space.lg }]}>
          <Icon name="shield" size={16} tint={color.gold} />
          <Txt variant="bodyXsMedium" tint={color.onDarkMuted}>
            Tagged by {i.verifiedRaters} verified attendees
          </Txt>
        </View>
      </View>

      <View style={styles.body}>
        <Txt variant="headingXs">Coaching style</Txt>
        <View style={styles.wrap}>
          {tags.map((t) => (
            <Tag key={t.tag} label={`${t.tag} · ${t.count}`} kind={state.prefs.dealbreakers.includes(t.tag) ? 'warn' : state.prefs.likedCoaching.includes(t.tag) ? 'tint' : 'outline'} />
          ))}
        </View>

        <Txt variant="headingXs" style={{ marginTop: space.md }}>
          Music
        </Txt>
        <View style={styles.music}>
          <View style={styles.play}>
            <Icon name="play" size={16} tint={color.onDark} />
          </View>
          <View>
            <Txt variant="bodySmMedium">{i.playlist}</Txt>
            <Txt variant="bodyXs" tint={color.textSecondary}>
              {i.music.join(' · ')}
            </Txt>
          </View>
        </View>

        <View style={{ marginTop: space.md }}>
          <RatingBar label="Felt intensity" value={i.ratings.intensity} />
          <RatingBar label="Music" value={i.ratings.music} />
          <RatingBar label="Overall attitude" value={i.ratings.attitude} accent={color.gold} />
        </View>

        <Txt variant="bodyMdMedium" style={{ marginTop: space.md }}>
          Upcoming classes
        </Txt>
        {upcoming.map((c, idx) => (
          <View key={c.id}>
            <View style={[styles.row, { paddingVertical: 10 }]}>
              <View style={{ flex: 1 }}>
                <Txt variant="bodySmMedium">
                  {c.day} {formatTime(c.start)} · {c.title}
                </Txt>
                <Txt variant="bodyXs" tint={color.textSecondary}>
                  {byId.studio(c.studioId)?.name} · {byId.studio(c.studioId)?.distanceMi} mi
                </Txt>
              </View>
              <Button size="sm" label="Book" onPress={() => router.push(`/explore/class/${c.id}`)} />
            </View>
            {idx < upcoming.length - 1 ? <Divider /> : null}
          </View>
        ))}
        <Badge label={following ? "You'll be notified when new classes are added" : 'Follow to get notified about new classes'} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  hero: { backgroundColor: color.inverse, paddingHorizontal: space.xl, paddingBottom: space.xl },
  matchPill: { backgroundColor: color.gold, borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 4 },
  followPill: { borderWidth: 1, borderColor: color.onDark, borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 4 },
  body: { paddingHorizontal: space.xl, paddingTop: space.xl, gap: 12 },
  music: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: color.subtle, borderRadius: radius.default, padding: 12 },
  play: { width: 32, height: 32, borderRadius: 16, backgroundColor: color.primary, alignItems: 'center', justifyContent: 'center' },
});
