import { Redirect } from 'expo-router';
import { Tabs } from 'expo-router/js-tabs';
import { WellnessTabBar } from '@/components/layout';
import { useApp } from '@/state/AppState';

export default function TabsLayout() {
  const { state } = useApp();
  if (!state.onboarded) return <Redirect href="/welcome" />;
  return (
    <Tabs tabBar={(props) => <WellnessTabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="explore" />
      <Tabs.Screen name="rate" />
      <Tabs.Screen name="saved" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
