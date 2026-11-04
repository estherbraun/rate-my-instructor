// W12 · Compare side by side — turns a gut call into a 5-second choice.
import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { BackHeader, Screen } from '@/components/layout';
import { Avatar, Button, Txt } from '@/components/ui';
import { byId, classes } from '@/data/mock';
import type { CoachingTag, Instructor } from '@/data/types';
import { dealbreakerFlags, formatTime, matchScore } from '@/lib/logic';
import { useApp } from '@/state/AppState';
import { color, radius, space } from '@/theme/tokens';

const freq = (i: Instructor, tag: CoachingTag) => {
  const total = i.coaching.reduce((s, t) => s + t.count, 0) || 1;
  const n = i.coaching.find((t) => t.tag === tag)?.count ?? 0;
  const share = n / total;
  return share >= 0.15 ? 'Often' : share >= 0.05 ? 'Sometimes' : 'Rarely';
};

export default function Compare() {
  const { a, b } = useLocalSearchParams<{ a: string; b: string }>();
  const { state } = useApp();
  const pair = [byId.instructor(a), byId.instructor(b)].filter(Boolean) as Instructor[];
  if (pair.length !== 2) return null;
  const scores = pair.map((i) => matchScore(i, state.prefs));
  const best = scores[0] >= scores[1] ? 0 : 1;
  const next = pair.map((i) => classes.filter((c) => c.instructorId === i.id).sort((x, y) => x.start - y.start)[0]);
  const style = (i: Instructor) => [...i.coaching].sort((x, y) => y.count - x.count).slice(0, 2).map((t) => t.tag).join(', ');

  const rows: [string, string, string, boolean?][] = [
    ['Match', `${scores[0]}%`, `${scores[1]}%`],
    ['Coaching', style(pair[0]), style(pair[1])],
    ['Calls people out', freq(pair[0], 'Calls people out'), freq(pair[1], 'Calls people out')],
    ['Honest countdowns', freq(pair[0], 'Honest countdowns'), freq(pair[1], 'Honest countdowns')],
    ['Music', pair[0].music.join(', '), pair[1].music.join(', ')],
    ['Felt intensity', pair[0].ratings.intensity.toFixed(1), pair[1].ratings.intensity.toFixed(1)],
    ['Overall attitude', pair[0].ratings.attitude.toFixed(1), pair[1].ratings.attitude.toFixed(1)],
    ['Dealbreakers', String(dealbreakerFlags(pair[0], state.prefs).length || 'None'), String(dealbreakerFlags(pair[1], state.prefs).length || 'None')],
    ['Next class', next[0] ? `${next[0].day} ${formatTime(next[0].start)}` : '—', next[1] ? `${next[1].day} ${formatTime(next[1].start)}` : '—'],
  ];

  return (
    <Screen>
      <BackHeader title="Compare instructors" />
      <View style={styles.table}>
        <View style={[styles.col, { left: best === 0 ? '36%' : '68%' }]} />
        <View style={styles.row}>
          <View style={styles.label} />
          {pair.map((i, idx) => (
            <View key={i.id} style={styles.cell}>
              <Avatar initials={i.initials} tone={i.tone} size={56} />
              <Txt variant="bodySmMedium" center style={{ marginTop: 6 }}>
                {i.name}
              </Txt>
              {idx === best ? (
                <View style={styles.best}>
                  <Txt variant="bodyXsMedium" tint={color.onDark}>
                    Best match
                  </Txt>
                </View>
              ) : null}
            </View>
          ))}
        </View>
        {rows.map(([label, x, y]) => (
          <View key={label} style={[styles.row, styles.dataRow]}>
            <Txt variant="bodySm" tint={color.textSecondary} style={styles.label}>
              {label}
            </Txt>
            {[x, y].map((v, idx) => (
              <View key={idx} style={styles.cell}>
                <Txt variant="bodySmMedium" center>
                  {v}
                </Txt>
              </View>
            ))}
          </View>
        ))}
        <View style={[styles.row, { marginTop: space.lg }]}>
          <View style={styles.label} />
          {next.map((c, idx) => (
            <View key={idx} style={styles.cell}>
              <Button size="sm" kind={idx === best ? 'primary' : 'secondary'} label="Book" disabled={!c} onPress={() => c && router.push(`/explore/class/${c.id}`)} style={{ alignSelf: 'stretch', marginHorizontal: 6 }} />
            </View>
          ))}
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  table: { marginTop: space.md },
  col: { position: 'absolute', top: 0, bottom: 0, width: '32%', backgroundColor: color.tint, borderRadius: radius.default },
  row: { flexDirection: 'row', alignItems: 'center' },
  dataRow: { borderTopWidth: 1, borderTopColor: color.border, minHeight: 52, paddingVertical: 8 },
  label: { width: '36%', paddingRight: 8 },
  cell: { width: '32%', alignItems: 'center', paddingHorizontal: 4, paddingVertical: 8 },
  best: { backgroundColor: color.primary, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 2, marginTop: 6 },
});
