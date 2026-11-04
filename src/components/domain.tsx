import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { byId } from '@/data/mock';
import type { ClassSession, Instructor } from '@/data/types';
import { dealbreakerFlags, formatTime, matchScore } from '@/lib/logic';
import { useApp } from '@/state/AppState';
import { color, space } from '@/theme/tokens';
import { Avatar, Badge, Card, Icon, Photo, StarIcon, Tag, Txt } from './ui';

export function ClassCard({ session }: { session: ClassSession }) {
  const { state } = useApp();
  const studio = byId.studio(session.studioId)!;
  const instructor = byId.instructor(session.instructorId)!;
  const match = matchScore(instructor, state.prefs);
  return (
    <Card onPress={() => router.push(`/explore/class/${session.id}`)} style={{ gap: 12 }}>
      <View style={styles.row}>
        <Photo tone={session.tone} height={84} width={84} />
        <View style={{ flex: 1, gap: 2 }}>
          <View style={[styles.row, { justifyContent: 'space-between' }]}>
            <Txt variant="eyebrow" tint={color.textAccent}>
              {formatTime(session.start)} · {session.durationMin} min
            </Txt>
            <Badge label={`${match}%`} />
          </View>
          <Txt variant="bodyMdMedium">{session.title}</Txt>
          <Txt variant="bodyXs" tint={color.textSecondary}>
            {studio.name} · {studio.distanceMi} mi
          </Txt>
          <View style={[styles.row, { gap: 6, marginTop: 4 }]}>
            <Avatar initials="" tone={instructor.tone} size={20} />
            <Txt variant="bodyXsMedium">{instructor.name}</Txt>
            <StarIcon size={13} />
            <Txt variant="bodyXsMedium">{instructor.ratings.attitude.toFixed(1)}</Txt>
          </View>
        </View>
      </View>
      <View style={styles.wrap}>
        <Tag label={session.focus} kind="tint" />
        <Tag label={`${session.intensity} intensity`} kind="tint" />
        <Tag label={session.heated ? 'Heated' : 'Not heated'} kind="tint" />
      </View>
    </Card>
  );
}

export function InstructorCard({
  instructor,
  selected,
  onToggleSelect,
  subtitle,
}: {
  instructor: Instructor;
  selected?: boolean;
  onToggleSelect?: () => void;
  subtitle?: string;
}) {
  const { state } = useApp();
  const match = matchScore(instructor, state.prefs);
  const flags = dealbreakerFlags(instructor, state.prefs);
  const topTags = [...instructor.coaching].sort((a, b) => b.count - a.count).slice(0, 3);
  return (
    <Card onPress={() => router.push(`/explore/instructor/${instructor.id}`)} highlighted={match >= 80} style={{ gap: 12 }}>
      <View style={styles.row}>
        <Avatar initials={instructor.initials} tone={instructor.tone} size={52} />
        <View style={{ flex: 1, gap: 4 }}>
          <Txt variant="bodyMdMedium">{instructor.name}</Txt>
          <View style={[styles.row, { gap: 8 }]}>
            <Badge label={`${match}% match`} dark={flags.length === 0} />
            {subtitle ? (
              <Txt variant="bodyXs" tint={color.textSecondary}>
                {subtitle}
              </Txt>
            ) : null}
          </View>
        </View>
        {onToggleSelect ? (
          <Pressable
            accessibilityRole="checkbox"
            accessibilityState={{ checked: !!selected }}
            accessibilityLabel={`Compare ${instructor.name}`}
            hitSlop={12}
            onPress={onToggleSelect}
          >
            <Icon name={selected ? 'check-square' : 'square'} size={22} tint={selected ? color.primary : color.borderStrong} />
          </Pressable>
        ) : null}
      </View>
      <View style={styles.wrap}>
        {topTags.map((t) => (
          <Tag key={t.tag} label={t.tag} kind={state.prefs.dealbreakers.includes(t.tag) ? 'warn' : 'tint'} />
        ))}
      </View>
      {flags.length ? (
        <View style={[styles.row, { gap: 6 }]}>
          <Icon name="alert-triangle" size={14} tint={color.goldDeep} />
          <Txt variant="bodyXsMedium" tint={color.textSecondary}>
            Has {flags.length === 1 ? 'one' : flags.length} of your dealbreakers
          </Txt>
        </View>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: space.md + 4 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
});
