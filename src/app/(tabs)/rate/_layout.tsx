import { Stack } from 'expo-router';
import { RateDraftProvider } from '@/state/RateDraft';
import { color } from '@/theme/tokens';

export default function RateLayout() {
  return (
    <RateDraftProvider>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: color.canvas } }} />
    </RateDraftProvider>
  );
}
