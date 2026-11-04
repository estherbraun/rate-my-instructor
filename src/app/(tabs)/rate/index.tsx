// Rate tab — pick a verified class to rate. Only attended bookings can be rated (validation).
import { router } from 'expo-router';
import { View } from 'react-native';
import { Screen } from '@/components/layout';
import { Button, Card, Icon, Photo, Txt } from '@/components/ui';
import { byId } from '@/data/mock';
import { formatTime } from '@/lib/logic';
import { useApp } from '@/state/AppState';
import { color, space } from '@/theme/tokens';
import { emptyDraft, useRateDraft } from '@/state/RateDraft';

export default function RateHome() {
  const { state } = useApp();
  const [, setDraft] = useRateDraft();
  const toRate = state.bookings.filter((b) => b.status === 'attended' && !b.reviewed);
  const upcoming = state.bookings.filter((b) => b.status === 'upcoming');

  return (
    <Screen>
      <Txt variant="headingMd">Rate a class</Txt>
      <Txt variant="bodySm" tint={color.textSecondary} style={{ marginTop: 4 }}>
        Only classes you actually attended can be rated, so every review is verified.
      </Txt>

      <View style={{ gap: 12, marginTop: space.xl }}>
        <Txt variant="eyebrow" tint={color.textAccent}>
          Ready to rate
        </Txt>
        {toRate.length === 0 ? (
          <Card style={{ alignItems: 'center', gap: 6, paddingVertical: space.xl }}>
            <Icon name="check-circle" size={28} tint={color.positive} />
            <Txt variant="bodyMdMedium">You're all caught up</Txt>
            <Txt variant="bodyXs" tint={color.textSecondary} center>
              After your next class, we'll ask how it went.
            </Txt>
          </Card>
        ) : (
          toRate.map((b) => {
            const c = byId.class(b.classId)!;
            const i = byId.instructor(c.instructorId)!;
            const s = byId.studio(c.studioId)!;
            return (
              <Card key={b.id} style={{ gap: 12 }}>
                <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
                  <Photo tone={c.tone} height={64} width={64} />
                  <View style={{ flex: 1 }}>
                    <Txt variant="eyebrow" tint={color.textAccent}>
                      {c.day} · {formatTime(c.start)}
                    </Txt>
                    <Txt variant="bodyMdMedium">{c.title}</Txt>
                    <Txt variant="bodyXs" tint={color.textSecondary}>
                      {i.name} · {s.name}
                    </Txt>
                  </View>
                </View>
                <Button
                  label="Rate this class"
                  onPress={() => {
                    setDraft(emptyDraft(b.id));
                    router.push({ pathname: '/rate/instructor', params: { bookingId: b.id } });
                  }}
                />
              </Card>
            );
          })
        )}
      </View>

      {upcoming.length ? (
        <View style={{ gap: 12, marginTop: space.xl }}>
          <Txt variant="eyebrow" tint={color.textMuted}>
            Coming up · rate after class
          </Txt>
          {upcoming.map((b) => {
            const c = byId.class(b.classId)!;
            return (
              <Card key={b.id} onPress={() => router.push(`/explore/class/${c.id}`)}>
                <Txt variant="bodyMdMedium">{c.title}</Txt>
                <Txt variant="bodyXs" tint={color.textSecondary}>
                  {c.day} · {formatTime(c.start)} · {byId.studio(c.studioId)?.name}
                </Txt>
              </Card>
            );
          })}
        </View>
      ) : null}

      {state.reviews.length ? (
        <Txt variant="bodySm" tint={color.textSecondary} style={{ marginTop: space.xl }}>
          You've posted {state.reviews.length} verified {state.reviews.length === 1 ? 'review' : 'reviews'}.
        </Txt>
      ) : null}
    </Screen>
  );
}
