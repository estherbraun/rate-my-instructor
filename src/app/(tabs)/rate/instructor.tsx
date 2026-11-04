// W15 · Rate the instructor — effort as felt push, music, coaching-style tags, attitude.
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';
import { BackHeader, Screen, StepProgress } from '@/components/layout';
import { Avatar, Button, ChipGroup, Icon, Scale, Stars, Txt } from '@/components/ui';
import { byId } from '@/data/mock';
import { DEALBREAKER_TAGS, POSITIVE_TAGS, type CoachingTag } from '@/data/types';
import { formatTime } from '@/lib/logic';
import { useApp } from '@/state/AppState';
import { emptyDraft, useRateDraft } from '@/state/RateDraft';
import { color, radius, space } from '@/theme/tokens';

const TAGS: CoachingTag[] = [...POSITIVE_TAGS, ...DEALBREAKER_TAGS];

export default function RateInstructor() {
  const { bookingId } = useLocalSearchParams<{ bookingId?: string }>();
  const { state } = useApp();
  const [draft, setDraft] = useRateDraft();

  // Arriving from the post-class prompt starts a fresh draft for that booking.
  useEffect(() => {
    if (bookingId && draft.bookingId !== bookingId) setDraft(emptyDraft(bookingId));
  }, [bookingId, draft.bookingId, setDraft]);

  const booking = state.bookings.find((b) => b.id === (bookingId ?? draft.bookingId));
  const c = booking ? byId.class(booking.classId) : undefined;
  if (!booking || !c) {
    return (
      <Screen>
        <BackHeader title="Rate a class" />
        <Txt variant="bodyMd">Pick a class you attended from the Rate tab.</Txt>
      </Screen>
    );
  }
  const i = byId.instructor(c.instructorId)!;
  const d = draft.instructor;
  const set = (patch: Partial<typeof d>) => setDraft((x) => ({ ...x, instructor: { ...x.instructor, ...patch } }));
  const complete = d.effort > 0 && d.music > 0 && d.attitude > 0;

  return (
    <Screen footer={<Button label="Next: rate the studio" disabled={!complete} onPress={() => router.push('/rate/studio')} />}>
      <BackHeader eyebrow="Step 1 of 2 · Instructor" />
      <StepProgress step={1} total={2} />

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: color.subtle, borderRadius: radius.default, padding: 12, marginTop: space.lg }}>
        <Avatar initials={i.initials} tone={i.tone} size={44} />
        <View style={{ flex: 1 }}>
          <Txt variant="bodyMdMedium">
            {i.name} · {c.title}
          </Txt>
          {booking.verified ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Icon name="shield" size={14} tint={color.positive} />
              <Txt variant="bodyXsMedium" tint={color.positive}>
                Verified attendee · {c.day} {formatTime(c.start)}
              </Txt>
            </View>
          ) : null}
        </View>
      </View>

      <View style={{ gap: space.xl, marginTop: space.xl }}>
        <View style={{ gap: 12 }}>
          <Txt variant="bodyMdMedium">How hard did this push you?</Txt>
          <Scale value={d.effort} onChange={(effort) => set({ effort })} low="Easy" high="Destroyed me" />
        </View>
        <View style={{ gap: 12 }}>
          <Txt variant="bodyMdMedium">Music</Txt>
          <Stars label="Music" value={d.music} onChange={(music) => set({ music })} />
        </View>
        <View style={{ gap: 12 }}>
          <Txt variant="bodyMdMedium">
            Coaching style{' '}
            <Txt variant="bodyXs" tint={color.textMuted}>
              tap all that apply
            </Txt>
          </Txt>
          <ChipGroup options={TAGS} selected={d.tags} onToggle={(t) => set({ tags: d.tags.includes(t) ? d.tags.filter((x) => x !== t) : [...d.tags, t] })} />
        </View>
        <View style={{ gap: 12 }}>
          <Txt variant="bodyMdMedium">Overall attitude</Txt>
          <Stars label="Overall attitude" value={d.attitude} onChange={(attitude) => set({ attitude })} />
        </View>
      </View>
    </Screen>
  );
}
