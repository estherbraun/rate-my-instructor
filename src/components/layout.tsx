import { router } from 'expo-router';
import type { BottomTabBarProps } from 'expo-router/js-tabs';
import type { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { color, space } from '@/theme/tokens';
import { Icon, IconButton, Txt, type IconName } from './ui';

/** Scrollable page with RHDS spacing (24px gutters) and an optional sticky footer. */
export function Screen({
  children,
  footer,
  bg = color.canvas,
  padded = true,
  topInset = true,
  contentStyle,
}: {
  children: ReactNode;
  footer?: ReactNode;
  bg?: string;
  padded?: boolean;
  topInset?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
}) {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      <ScrollView
        contentContainerStyle={[
          // Extra bottom room so the raised gold Rate button never covers content.
          { paddingTop: topInset ? insets.top + space.lg : 0, paddingBottom: space['4xl'] },
          padded && { paddingHorizontal: space.xl },
          contentStyle,
        ]}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
      {footer ? <View style={[styles.footer, { backgroundColor: bg }]}>{footer}</View> : null}
    </View>
  );
}

export function BackHeader({ title, eyebrow, right }: { title?: string; eyebrow?: string; right?: ReactNode }) {
  return (
    <View style={styles.header}>
      <Pressable accessibilityRole="button" accessibilityLabel="Back" hitSlop={10} onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}>
        <Icon name="chevron-left" size={26} />
      </Pressable>
      <View style={{ flex: 1 }}>
        {eyebrow ? (
          <Txt variant="eyebrow" tint={color.textMuted}>
            {eyebrow}
          </Txt>
        ) : null}
        {title ? <Txt variant="headingXs">{title}</Txt> : null}
      </View>
      {right}
    </View>
  );
}

/** Floating back / action buttons over a full-bleed hero photo. */
export function HeroActions({ right }: { right?: ReactNode }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.heroActions, { top: insets.top + 8 }]}>
      <IconButton name="chevron-left" label="Back" onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))} />
      {right}
    </View>
  );
}

export function StepProgress({ step, total }: { step: number; total: number }) {
  return (
    <View style={{ flexDirection: 'row', gap: 8, marginTop: space.md }}>
      {Array.from({ length: total }, (_, i) => (
        <View key={i} style={{ flex: 1, height: 3, borderRadius: 64, backgroundColor: i < step ? color.primary : color.border }} />
      ))}
    </View>
  );
}

const TAB_ROOT: Record<string, '/' | '/explore' | '/rate' | '/saved' | '/profile'> = {
  index: '/',
  explore: '/explore',
  rate: '/rate',
  saved: '/saved',
  profile: '/profile',
};

const TABS: Record<string, { label: string; icon: IconName }> = {
  index: { label: 'Home', icon: 'home' },
  explore: { label: 'Explore', icon: 'compass' },
  rate: { label: 'Rate', icon: 'plus' },
  saved: { label: 'Saved', icon: 'bookmark' },
  profile: { label: 'Profile', icon: 'user' },
};

/** The same 5-tab footer on every in-app screen; gold center "Rate" is the core action. */
export function WellnessTabBar({ state, emitter, navigateToTab }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.tabBar, { paddingBottom: Math.max(insets.bottom, 10) }]} accessibilityRole="tablist">
      {state.routes
        .filter((r) => TABS[r.name])
        .map((route) => {
          const index = state.routes.indexOf(route);
          const focused = state.index === index;
          const tab = TABS[route.name];
          const onPress = () => {
            const event = emitter.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (event.defaultPrevented) return;
            // Re-tapping the active tab pops its stack back to the tab's root screen.
            if (focused) router.navigate(TAB_ROOT[route.name]);
            else navigateToTab(route.key);
          };
          const tint = focused ? color.primary : color.textMuted;
          if (route.name === 'rate') {
            return (
              <Pressable key={route.key} onPress={onPress} accessibilityRole="tab" accessibilityLabel="Rate a class" accessibilityState={{ selected: focused }} style={styles.tabItem}>
                <View style={styles.rateButton}>
                  <Icon name="plus" size={26} tint={color.text} />
                </View>
                <Txt variant="bodyXsMedium" tint={tint}>
                  {tab.label}
                </Txt>
              </Pressable>
            );
          }
          return (
            <Pressable key={route.key} onPress={onPress} accessibilityRole="tab" accessibilityLabel={tab.label} accessibilityState={{ selected: focused }} style={styles.tabItem}>
              {focused ? <View style={styles.tabIndicator} /> : null}
              <Icon name={tab.icon} size={24} tint={tint} />
              <Txt variant="bodyXsMedium" tint={tint}>
                {tab.label}
              </Txt>
            </Pressable>
          );
        })}
    </View>
  );
}

const styles = StyleSheet.create({
  footer: { paddingHorizontal: space.xl, paddingTop: space.md, paddingBottom: space['2xl'], borderTopWidth: 1, borderTopColor: color.border, gap: 10 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: space.lg },
  heroActions: { position: 'absolute', left: 20, right: 20, flexDirection: 'row', justifyContent: 'space-between' },
  tabBar: { flexDirection: 'row', backgroundColor: color.canvas, borderTopWidth: 1, borderTopColor: color.border, paddingTop: 8 },
  tabItem: { flex: 1, alignItems: 'center', gap: 4 },
  tabIndicator: { position: 'absolute', top: -9, width: 28, height: 3, backgroundColor: color.gold },
  rateButton: { width: 52, height: 52, borderRadius: 26, backgroundColor: color.highlight, alignItems: 'center', justifyContent: 'center', marginTop: -24 },
});
