// W16 · Rate the studio — facility problems get their own scores, never the instructor's.
import { router } from 'expo-router';
import { TextInput, View } from 'react-native';
import { BackHeader, Screen, StepProgress } from '@/components/layout';
import { Button, ChipGroup, Icon, Segmented, Stars, Txt } from '@/components/ui';
import { byId } from '@/data/mock';
import { useApp } from '@/state/AppState';
import { useRateDraft } from '@/state/RateDraft';
import { color, radius, space, type as typeScale } from '@/theme/tokens';

const AMENITIES = ['Showers', 'Free water', 'Lockers', 'Parking'];

export default function RateStudio() {
  const { state, dispatch } = useApp();
  const [draft, setDraft] = useRateDraft();
  const booking = state.bookings.find((b) => b.id === draft.bookingId);
  const c = booking ? byId.class(booking.classId) : undefined;
  if (!booking || !c) {
    return (
      <Screen>
        <BackHeader title="Rate a class" />
        <Txt variant="bodyMd">Start from the Rate tab.</Txt>
      </Screen>
    );
  }
  const studio = byId.studio(c.studioId)!;
  const instructor = byId.instructor(c.instructorId)!;
  const s = draft.studio;
  const set = (patch: Partial<typeof s>) => setDraft((x) => ({ ...x, studio: { ...x.studio, ...patch } }));
  const complete = s.cleanliness > 0 && s.frontDesk > 0;

  const submit = () => {
    const id = `r-${Date.now()}`;
    dispatch({
      type: 'submitReview',
      review: { id, bookingId: booking.id, instructor: draft.instructor, studio: s, verified: booking.verified, createdAt: new Date().toISOString() },
    });
    router.replace({ pathname: '/rate/posted', params: { id } });
  };

  return (
    <Screen footer={<Button label="Submit review" disabled={!complete} onPress={submit} />}>
      <BackHeader eyebrow="Step 2 of 2 · Studio" />
      <StepProgress step={2} total={2} />
      <Txt variant="headingSm" style={{ marginTop: space.lg }}>
        {studio.name}
      </Txt>

      <View style={{ gap: space.xl, marginTop: space.lg }}>
        <Row label="Cleanliness">
          <Stars label="Cleanliness" size={24} value={s.cleanliness} onChange={(cleanliness) => set({ cleanliness })} />
        </Row>
        <Row label="Front desk">
          <Stars label="Front desk" size={24} value={s.frontDesk} onChange={(frontDesk) => set({ frontDesk })} />
        </Row>
        <View style={{ gap: 12 }}>
          <Txt variant="bodyMdMedium">Amenities</Txt>
          <ChipGroup options={AMENITIES} selected={s.amenities} onToggle={(a) => set({ amenities: s.amenities.includes(a) ? s.amenities.filter((x) => x !== a) : [...s.amenities, a] })} />
        </View>
        <View style={{ gap: 12 }}>
          <Txt variant="bodyMdMedium">Was the cost justified?</Txt>
          <Segmented options={['Yes', 'Somewhat', 'No'] as const} value={s.costJustified} onChange={(costJustified) => set({ costJustified })} />
        </View>
        <View style={{ gap: 12 }}>
          <Txt variant="bodyMdMedium">Heat as expected?</Txt>
          <Segmented options={['Yes', 'No'] as const} value={s.heatAsExpected ? 'Yes' : 'No'} onChange={(v) => set({ heatAsExpected: v === 'Yes' })} />
        </View>
        <TextInput
          accessibilityLabel="Comment about the studio"
          placeholder="Add a comment (optional)"
          placeholderTextColor={color.textMuted}
          multiline
          value={s.comment}
          onChangeText={(comment) => set({ comment })}
          style={[typeScale.bodySm, { color: color.text, minHeight: 80, backgroundColor: color.subtle, borderRadius: radius.default, padding: 12, textAlignVertical: 'top' }]}
        />
        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
          <Icon name="shield" size={16} tint={color.primary} />
          <Txt variant="bodyXsMedium" tint={color.textSecondary}>
            Studio scores never change {instructor.name.split(' ')[0]}'s rating.
          </Txt>
        </View>
      </View>
    </Screen>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <Txt variant="bodyMdMedium">{label}</Txt>
      {children}
    </View>
  );
}
