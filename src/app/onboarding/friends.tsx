// W03 · Sync contacts ("like Beli") — friends drive trial; no leaderboards.
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, View } from 'react-native';
import { BackHeader, Screen, StepProgress } from '@/components/layout';
import { Avatar, Button, Divider, Photo, Txt } from '@/components/ui';
import { friends } from '@/data/mock';
import { useApp } from '@/state/AppState';
import { color, space } from '@/theme/tokens';

export default function FriendsScreen() {
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const editing = mode === 'edit';
  const { state, dispatch } = useApp();
  const finish = () => {
    if (editing) return router.back();
    dispatch({ type: 'completeOnboarding' });
    router.replace('/');
  };
  return (
    <Screen
      footer={
        <>
          <Button label={editing ? 'Done' : 'Sync contacts'} onPress={finish} />
          {!editing ? (
            <Pressable accessibilityRole="link" onPress={finish} style={{ alignSelf: 'center', padding: 6 }}>
              <Txt variant="bodySmMedium" tint={color.primary} underline>
                Not now
              </Txt>
            </Pressable>
          ) : null}
        </>
      }
    >
      <BackHeader eyebrow={editing ? 'Profile' : 'Step 2 of 2'} />
      {!editing ? <StepProgress step={2} total={2} /> : null}
      <Photo tone="mist" height={170} label="friends walking to class" style={{ marginTop: space.xl }} />
      <View style={{ gap: 4, marginTop: space.xl }}>
        <Txt variant="headingMd">Better with friends</Txt>
        <Txt variant="bodySm" tint={color.textSecondary}>
          See where your friends train and what they rated. Invite them to a class in one tap.
        </Txt>
      </View>
      <View style={{ marginTop: space.xl }}>
        {friends.map((f, i) => {
          const added = state.syncedFriends.includes(f.id);
          return (
            <View key={f.id}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 12 }}>
                <Avatar initials={f.initials} tone={i % 2 ? 'gold' : 'spruce'} size={48} />
                <View style={{ flex: 1 }}>
                  <Txt variant="bodyMdMedium">{f.name}</Txt>
                  <Txt variant="bodyXs" tint={color.textSecondary}>
                    {f.note}
                  </Txt>
                </View>
                <Button size="sm" kind={added ? 'primary' : 'secondary'} label={added ? 'Added' : 'Add'} icon={added ? 'check' : undefined} onPress={() => dispatch({ type: 'toggleFriend', id: f.id })} />
              </View>
              {i < friends.length - 1 ? <Divider inset={62} /> : null}
            </View>
          );
        })}
      </View>
    </Screen>
  );
}
