// W17 · Review posted + share — instructor and studio scores shown separately.
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Screen } from '@/components/layout';
import { Avatar, Button, Card, Icon, Toggle, Txt, StarIcon } from '@/components/ui';
import { byId, friends } from '@/data/mock';
import { studioReviewScore } from '@/lib/logic';
import { useApp } from '@/state/AppState';
import { color, radius, space } from '@/theme/tokens';

export default function Posted() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { state } = useApp();
  const [askSore, setAskSore] = useState(true);
  const [shareWith, setShareWith] = useState<string[]>(['roommate']);
  const review = state.reviews.find((r) => r.id === id);
  const booking = review && state.bookings.find((b) => b.id === review.bookingId);
  const c = booking && byId.class(booking.classId);
  if (!review || !c) return null;
  const instructor = byId.instructor(c.instructorId)!;
  const studio = byId.studio(c.studioId)!;
  const instructorScore = Math.round(((review.instructor.music + review.instructor.attitude) / 2) * 10) / 10;
  const studioScore = studioReviewScore(review.studio);

  return (
    <Screen
      padded={false}
      topInset={false}
      footer={
        <>
          <Button label={`Share review${shareWith.length ? ` with ${shareWith.length}` : ''}`} icon="share" onPress={() => router.dismissTo('/rate')} />
          <Pressable accessibilityRole="link" onPress={() => router.dismissTo('/rate')} style={{ alignSelf: 'center', padding: 6 }}>
            <Txt variant="bodySmMedium" tint={color.primary} underline>
              Done
            </Txt>
          </Pressable>
        </>
      }
    >
      <StatusBar style="light" />
      <View style={[styles.hero, { paddingTop: insets.top + space.xl }]}>
        <View style={styles.badge}>
          <Icon name="check" size={36} tint={color.text} />
        </View>
        <Txt variant="headingMd" tint={color.onDark} center>
          Review posted
        </Txt>
        {review.verified ? (
          <View style={styles.verified}>
            <Icon name="shield" size={14} tint={color.gold} />
            <Txt variant="bodyXsMedium" tint={color.onDark}>
              Verified attendee
            </Txt>
          </View>
        ) : (
          <Txt variant="bodyXs" tint={color.onDarkMuted} center>
            Saved as unverified — weighted lower until attendance is confirmed.
          </Txt>
        )}
        <Txt variant="bodySm" tint={color.onDarkMuted} center>
          Thanks — your rating helps friends pick the right class.
        </Txt>
      </View>

      <View style={styles.body}>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Score label="Instructor" value={instructorScore} sub={instructor.name} gold />
          <Score label="Studio" value={studioScore} sub={studio.name} />
        </View>
        <View style={styles.sore}>
          <Icon name="bell" size={20} tint={color.primary} />
          <Txt variant="bodySmMedium" style={{ flex: 1 }}>
            Ask "Sore today?" tomorrow at 9 am
          </Txt>
          <Toggle label="Ask if sore tomorrow" value={askSore} onChange={setAskSore} />
        </View>
        <Txt variant="bodyMdMedium">Share with</Txt>
        <View style={{ flexDirection: 'row', gap: 16 }}>
          {friends.map((f, i) => {
            const on = shareWith.includes(f.id);
            return (
              <Pressable key={f.id} accessibilityRole="checkbox" accessibilityState={{ checked: on }} accessibilityLabel={`Share with ${f.name}`} onPress={() => setShareWith((x) => (on ? x.filter((y) => y !== f.id) : [...x, f.id]))} style={{ alignItems: 'center', gap: 4 }}>
                <View style={[styles.ring, on && { borderColor: color.primary }]}>
                  <Avatar initials={f.initials} tone={i % 2 ? 'gold' : 'spruce'} size={48} />
                </View>
                <Txt variant="bodyXsMedium" tint={on ? color.primary : color.textSecondary}>
                  {f.name.split(' ')[0]}
                </Txt>
              </Pressable>
            );
          })}
        </View>
      </View>
    </Screen>
  );
}

function Score({ label, value, sub, gold }: { label: string; value: number; sub: string; gold?: boolean }) {
  return (
    <Card style={{ flex: 1, gap: 2 }}>
      <Txt variant="eyebrow" tint={color.textMuted}>
        {label}
      </Txt>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <Txt variant="headingMd">{value.toFixed(1)}</Txt>
        <StarIcon size={18} tint={gold ? color.gold : color.borderStrong} />
      </View>
      <Txt variant="bodyXs" tint={color.textSecondary}>
        {sub}
      </Txt>
    </Card>
  );
}

const styles = StyleSheet.create({
  hero: { backgroundColor: color.inverse, alignItems: 'center', gap: 10, paddingHorizontal: space.xl, paddingBottom: space.xl },
  badge: { width: 80, height: 80, borderRadius: 40, backgroundColor: color.gold, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  verified: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: color.inverseRaised, borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 4 },
  body: { paddingHorizontal: space.xl, paddingTop: space.xl, gap: space.lg },
  sore: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: color.subtle, borderRadius: radius.default, padding: 14 },
  ring: { borderWidth: 2, borderColor: 'transparent', borderRadius: 28, padding: 2 },
});
