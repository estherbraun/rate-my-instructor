// W13 · Studio profile (shared view) — studio rated separately from instructors.
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { ClassCard } from '@/components/domain';
import { HeroActions, Screen } from '@/components/layout';
import { Avatar, Card, Icon, IconButton, Photo, RatingBar, Tag, Txt } from '@/components/ui';
import { byId, classes, instructors } from '@/data/mock';
import { matchScore } from '@/lib/logic';
import { useApp } from '@/state/AppState';
import { color, radius, space } from '@/theme/tokens';

export default function StudioProfile() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state, dispatch } = useApp();
  const s = byId.studio(id);
  if (!s) return null;
  const saved = state.saved.studios.includes(s.id);
  const here = instructors.filter((i) => i.studioIds.includes(s.id));
  const classesHere = classes.filter((c) => c.studioId === s.id);
  const r = s.ratings;

  return (
    <Screen padded={false} topInset={false}>
      <StatusBar style="light" />
      <Photo tone={s.tone} height={210} label={`${s.name} lobby`} style={{ borderRadius: 0 }} />
      <HeroActions right={<IconButton name="heart" label={saved ? 'Remove from saved' : 'Save studio'} onPress={() => dispatch({ type: 'toggleSaved', kind: 'studios', id: s.id })} />} />
      <View style={styles.body}>
        <View style={{ gap: 4 }}>
          <Txt variant="headingMd">{s.name}</Txt>
          <Txt variant="bodySm" tint={color.textSecondary}>
            {s.distanceMi} mi · {s.neighborhood} · {s.formats.join(' · ')}
          </Txt>
          {s.introOffer ? <View style={{ marginTop: 6 }}><Tag label={s.introOffer} kind="gold" /></View> : null}
        </View>

        <View style={styles.ratings}>
          <Txt variant="bodyMdMedium">Studio ratings</Txt>
          <Txt variant="bodyXs" tint={color.textSecondary} style={{ marginBottom: 8 }}>
            Rated separately from instructors · {s.verifiedRaters} verified
          </Txt>
          <RatingBar label="Cleanliness" value={r.cleanliness} />
          <RatingBar label="Front desk" value={r.frontDesk} />
          <RatingBar label="Showers & water" value={r.amenities} />
          <RatingBar label="Parking" value={r.parking} />
          <RatingBar label="Cost justified" value={r.costJustified} />
          <RatingBar label="Heat / temperature" value={r.heat} />
        </View>

        <Txt variant="headingXs">Instructors here</Txt>
        {here.map((i) => (
          <Card key={i.id} onPress={() => router.push(`/explore/instructor/${i.id}`)} style={styles.rowCard}>
            <Avatar initials={i.initials} tone={i.tone} size={44} />
            <View style={{ flex: 1 }}>
              <Txt variant="bodyMdMedium">{i.name}</Txt>
              <Txt variant="bodyXs" tint={color.textSecondary}>
                {matchScore(i, state.prefs)}% match · {[...i.coaching].sort((a, b) => b.count - a.count).slice(0, 2).map((t) => t.tag).join(' · ')}
              </Txt>
            </View>
            <Icon name="chevron-right" size={20} tint={color.textMuted} />
          </Card>
        ))}

        <Txt variant="headingXs" style={{ marginTop: space.md }}>
          Classes here
        </Txt>
        {classesHere.map((c) => (
          <ClassCard key={c.id} session={c} />
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { paddingHorizontal: space.xl, paddingTop: space.lg, gap: space.lg },
  ratings: { backgroundColor: color.subtle, borderRadius: radius.default, padding: space.lg },
  rowCard: { flexDirection: 'row', alignItems: 'center', gap: 12 },
});
