// W08 · Class detail (shared view) — "what am I signing up for?" answered with facts.
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, View } from 'react-native';
import { HeroActions, Screen } from '@/components/layout';
import { Avatar, Button, Card, Icon, IconButton, Photo, Tag, Txt, type IconName, StarIcon } from '@/components/ui';
import { byId } from '@/data/mock';
import { formatRange, matchScore } from '@/lib/logic';
import { useApp } from '@/state/AppState';
import { color, radius, space } from '@/theme/tokens';

export default function ClassDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state, dispatch } = useApp();
  const c = byId.class(id);
  if (!c) return <NotFound />;
  const studio = byId.studio(c.studioId)!;
  const instructor = byId.instructor(c.instructorId)!;
  const saved = state.saved.classes.includes(c.id);
  const topTags = [...instructor.coaching].sort((a, b) => b.count - a.count).slice(0, 2).map((t) => t.tag);

  const facts: [IconName, string, string][] = [
    ['grid', 'Format', `${c.format} · ${c.durationMin} min`],
    ['target', 'Focus', c.focus],
    ['sun', 'Heated', c.heated ? 'Yes' : 'No'],
    ['activity', 'Equipment', c.beginnerFriendly ? `${c.equipment} · beginner-friendly` : c.equipment],
  ];

  return (
    <Screen
      padded={false}
      topInset={false}
      footer={
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Button
            label="Book on ClassPass"
            style={{ flex: 1 }}
            onPress={() => {
              dispatch({ type: 'book', classId: c.id });
              router.push(`/explore/booked/${c.id}`);
            }}
          />
          <Pressable accessibilityRole="button" accessibilityLabel={saved ? 'Remove from want to try' : 'Save to want to try'} onPress={() => dispatch({ type: 'toggleSaved', kind: 'classes', id: c.id })} style={styles.heart}>
            <Icon name="heart" size={22} tint={saved ? color.goldDeep : color.text} />
          </Pressable>
        </View>
      }
    >
      <StatusBar style="light" />
      <Photo tone={c.tone} height={240} label={`${c.title} at ${studio.name}`} style={{ borderRadius: 0 }} />
      <HeroActions right={<IconButton name="share" label="Share class" />} />

      <View style={styles.body}>
        <View style={{ gap: 2 }}>
          <Txt variant="eyebrow" tint={color.textAccent}>
            {c.day} · {formatRange(c.start, c.durationMin)}
          </Txt>
          <Txt variant="headingMd">{c.title}</Txt>
          <Txt variant="bodySm" tint={color.textSecondary}>
            {studio.name} · {studio.distanceMi} mi · {studio.neighborhood}
          </Txt>
        </View>

        <View style={{ gap: 12 }}>
          <Txt variant="bodyMdMedium">What to expect</Txt>
          <View style={styles.facts}>
            {facts.map(([icon, label, value]) => (
              <View key={label} style={styles.fact}>
                <Icon name={icon} size={20} tint={color.primary} />
                <View style={{ flex: 1 }}>
                  <Txt variant="bodyXs" tint={color.textMuted}>
                    {label}
                  </Txt>
                  <Txt variant="bodySmMedium">{value}</Txt>
                </View>
              </View>
            ))}
          </View>
          <View style={styles.intensity}>
            <Icon name="zap" size={18} tint={color.goldDeep} />
            <Txt variant="bodyXsMedium" style={{ flex: 1 }}>
              Felt intensity · how hard it pushed people
            </Txt>
            <Txt variant="bodyMdMedium">{c.feltIntensity.toFixed(1)}</Txt>
          </View>
        </View>

        <Card onPress={() => router.push(`/explore/instructor/${instructor.id}`)} style={styles.rowCard}>
          <Avatar initials={instructor.initials} tone={instructor.tone} size={44} />
          <View style={{ flex: 1, gap: 2 }}>
            <View style={[styles.row, { gap: 6 }]}>
              <Txt variant="bodyMdMedium">{instructor.name}</Txt>
              <StarIcon size={14} />
              <Txt variant="bodySmMedium">{instructor.ratings.attitude.toFixed(1)}</Txt>
            </View>
            <Txt variant="bodyXs" tint={color.textSecondary}>
              {topTags.join(' · ')} · {matchScore(instructor, state.prefs)}% match
            </Txt>
          </View>
          <Icon name="chevron-right" size={20} tint={color.textMuted} />
        </Card>

        <Card onPress={() => router.push(`/explore/studio/${studio.id}`)} style={styles.rowCard}>
          <Txt variant="bodySm" tint={color.textSecondary} style={{ flex: 1 }}>
            Studio · Clean {studio.ratings.cleanliness.toFixed(1)} · {studio.amenities.join(' · ')}
          </Txt>
          <Icon name="chevron-right" size={20} tint={color.textMuted} />
        </Card>

        <View style={[styles.row, { justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }]}>
          {c.friendIds.length ? (
            <View style={[styles.row, { gap: 8 }]}>
              <View style={styles.row}>
                {c.friendIds.map((fid, i) => (
                  <View key={fid} style={{ marginLeft: i ? -8 : 0 }}>
                    <Avatar initials={byId.friend(fid)?.initials} tone={i % 2 ? 'gold' : 'spruce'} size={28} />
                  </View>
                ))}
              </View>
              <Txt variant="bodyXsMedium" tint={color.textSecondary}>
                {c.friendIds.length} {c.friendIds.length === 1 ? 'friend' : 'friends'} took this
              </Txt>
            </View>
          ) : (
            <View />
          )}
          {studio.introOffer ? <Tag label={studio.introOffer} kind="gold" /> : null}
        </View>
      </View>
    </Screen>
  );
}

function NotFound() {
  return (
    <Screen>
      <Txt variant="headingSm">Not found</Txt>
      <Button label="Back to Explore" kind="secondary" onPress={() => router.replace('/explore')} style={{ marginTop: space.lg }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  body: { paddingHorizontal: space.xl, paddingTop: space.lg, gap: space.lg },
  facts: { flexDirection: 'row', flexWrap: 'wrap', rowGap: 14 },
  fact: { width: '50%', flexDirection: 'row', gap: 10, paddingRight: 8 },
  intensity: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: color.goldTint, borderRadius: radius.default, paddingHorizontal: 12, height: 42 },
  rowCard: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  heart: { width: 52, height: 52, borderRadius: radius.default, borderWidth: 1.5, borderColor: color.borderStrong, alignItems: 'center', justifyContent: 'center' },
});
