// W09 · Booked confirmation — sage = calm success. Booking itself lives on ClassPass.
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Screen } from '@/components/layout';
import { Avatar, Button, Card, Icon, Photo, Txt } from '@/components/ui';
import { byId, friends } from '@/data/mock';
import { formatTime } from '@/lib/logic';
import { color, space } from '@/theme/tokens';

export default function Booked() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const c = byId.class(id);
  const [invited, setInvited] = useState<string[]>([]);
  const [inCalendar, setInCalendar] = useState(false);
  if (!c) return null;
  const studio = byId.studio(c.studioId)!;
  const instructor = byId.instructor(c.instructorId)!;
  return (
    <Screen
      bg={color.sage}
      footer={
        <>
          <Button kind="secondary" icon={inCalendar ? 'check' : 'calendar'} label={inCalendar ? 'Added to calendar' : 'Add to calendar'} onPress={() => setInCalendar(true)} />
          <Button label="Done" onPress={() => router.dismissTo('/explore')} />
        </>
      }
    >
      <View style={{ alignItems: 'center', gap: 8, marginTop: space.xl }}>
        <View style={styles.check}>
          <Icon name="check" size={40} tint={color.onDark} />
        </View>
        <Txt variant="headingMd" center style={{ marginTop: space.md }}>
          You're booked
        </Txt>
        <Txt variant="bodySm" tint={color.textSecondary} center>
          Confirmed on ClassPass and saved to your Upcoming classes.
        </Txt>
      </View>
      <Card style={[styles.row, { gap: 14, marginTop: space.xl, borderColor: 'transparent' }]}>
        <Photo tone={c.tone} height={80} width={80} />
        <View style={{ flex: 1, gap: 2 }}>
          <Txt variant="eyebrow" tint={color.textAccent}>
            {c.day} · {formatTime(c.start)}
          </Txt>
          <Txt variant="bodyMdMedium">{c.title}</Txt>
          <Txt variant="bodyXs" tint={color.textSecondary}>
            {studio.name} · with {instructor.name}
          </Txt>
        </View>
      </Card>
      <Txt variant="headingXs" style={{ marginTop: space.xl, marginBottom: space.lg }}>
        Go with a friend
      </Txt>
      <View style={[styles.row, { justifyContent: 'space-between' }]}>
        {friends.map((f, i) => {
          const on = invited.includes(f.id);
          return (
            <Pressable key={f.id} accessibilityRole="checkbox" accessibilityState={{ checked: on }} accessibilityLabel={`Invite ${f.name}`} onPress={() => setInvited((x) => (on ? x.filter((y) => y !== f.id) : [...x, f.id]))} style={{ alignItems: 'center', gap: 6 }}>
              <View style={[styles.ring, on && { borderColor: color.primary }]}>
                <Avatar initials={f.initials} tone={i % 2 ? 'gold' : 'spruce'} size={56} />
              </View>
              <Txt variant="bodyXsMedium" tint={on ? color.primary : color.textSecondary}>
                {on ? 'Invited' : f.name.split(' ')[0]}
              </Txt>
            </Pressable>
          );
        })}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  check: { width: 80, height: 80, borderRadius: 40, backgroundColor: color.primary, alignItems: 'center', justifyContent: 'center' },
  ring: { borderWidth: 2, borderColor: 'transparent', borderRadius: 32, padding: 2 },
});
