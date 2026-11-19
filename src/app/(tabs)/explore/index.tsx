// W05 · Explore classes, W06 · Filters sheet, W07 · No matches, W10 · Instructors for my slot.
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ClassCard, InstructorCard } from '@/components/domain';
import { Screen } from '@/components/layout';
import { Button, ChipGroup, Icon, Segmented, Toggle, Txt, UnderlineTabs } from '@/components/ui';
import { byId, classes, instructors } from '@/data/mock';
import type { ClassFilters, Focus, Format, Intensity, MusicGenre, TimeWindow } from '@/data/types';
import { activeFilterCount, defaultFilters, DISTANCE_STEPS, filterClasses, matchScore, relaxSuggestions, TIME_WINDOWS } from '@/lib/logic';
import { useApp } from '@/state/AppState';
import { color, radius, space } from '@/theme/tokens';

const FORMATS: Format[] = ['Yoga', 'Hot yoga', 'Pilates', 'HIIT', 'Cycle', 'Barre'];
const FOCUS: Focus[] = ['Full body', 'Arms & abs', 'Legs', 'Core', 'Mobility'];
const INTENSITY: Intensity[] = ['Easy', 'Medium', 'High'];
const MUSIC: MusicGenre[] = ['Hip-hop', 'Pop', 'House', 'Lo-fi', 'Acoustic'];
const toggle = <T,>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
const studioOf = (id: string) => byId.studio(id);

export default function Explore() {
  const { state } = useApp();
  const [tab, setTab] = useState<'Classes' | 'Instructors'>('Classes');
  const [filters, setFilters] = useState<ClassFilters>(() => defaultFilters(state.prefs));
  const [sheetOpen, setSheetOpen] = useState(false);
  const [compare, setCompare] = useState<string[]>([]);

  const results = useMemo(() => filterClasses(classes, filters, studioOf), [filters]);
  const suggestions = useMemo(() => (results.length ? [] : relaxSuggestions(classes, filters, studioOf)), [results, filters]);
  const ranked = useMemo(() => [...instructors].sort((a, b) => matchScore(b, state.prefs) - matchScore(a, state.prefs)), [state.prefs]);
  const count = activeFilterCount(filters);

  return (
    <Screen>
      <Txt variant="headingMd" style={{ marginBottom: space.lg }}>
        Explore
      </Txt>
      <UnderlineTabs options={['Classes', 'Instructors'] as const} value={tab} onChange={setTab} />

      {tab === 'Classes' ? (
        <>
          <View style={[styles.row, { marginTop: space.lg, gap: 8 }]}>
            <Pill icon="clock" label={filters.timeWindow ?? 'Any time'} onPress={() => setSheetOpen(true)} />
            <Pill icon="map-pin" label={`${filters.maxDistanceMi} mi`} onPress={() => setSheetOpen(true)} />
            {/* Usability testing: the icon-only filter button was easy to miss, so it is labeled and shows the active count. */}
            <Pressable accessibilityRole="button" accessibilityLabel={`Filters, ${count} active`} onPress={() => setSheetOpen(true)} style={styles.filterButton}>
              <Icon name="sliders" size={18} />
              <Txt variant="bodySmMedium">Filters</Txt>
              {count ? (
                <View style={styles.count}>
                  <Txt variant="bodyXsMedium">{count}</Txt>
                </View>
              ) : null}
            </Pressable>
          </View>

          {results.length ? (
            <View style={{ gap: 12, marginTop: space.lg }}>
              <Txt variant="bodySmMedium" tint={color.textSecondary}>
                {results.length} {results.length === 1 ? 'class fits' : 'classes fit'} your filters
              </Txt>
              {results.map((c) => (
                <ClassCard key={c.id} session={c} />
              ))}
            </View>
          ) : (
            <View style={{ alignItems: 'center', marginTop: space['2xl'], gap: 8 }}>
              <View style={styles.empty}>
                <Icon name="search" size={40} tint={color.primary} />
              </View>
              <Txt variant="headingSm" center>
                Nothing fits all your filters
              </Txt>
              <Txt variant="bodySm" tint={color.textSecondary} center>
                Loosen one thing and you're back in. Here's what each change gets you:
              </Txt>
              <View style={{ alignSelf: 'stretch', gap: 10, marginTop: space.md }}>
                {suggestions.map((s) => (
                  <Pressable key={s.label} accessibilityRole="button" onPress={() => setFilters(s.filters)} style={styles.suggestion}>
                    <Txt variant="bodyMdMedium" style={{ flex: 1 }}>
                      {s.label}
                    </Txt>
                    <View style={styles.suggestionCount}>
                      <Txt variant="bodyXsMedium" tint={color.primary}>
                        {s.count} {s.count === 1 ? 'class' : 'classes'}
                      </Txt>
                    </View>
                    <Icon name="chevron-right" size={20} tint={color.primary} />
                  </Pressable>
                ))}
              </View>
            </View>
          )}
        </>
      ) : (
        <View style={{ gap: 12, marginTop: space.lg }}>
          <Txt variant="bodyXs" tint={color.textSecondary}>
            Sorted by match with your coaching preferences. Select two to compare.
          </Txt>
          {ranked.map((i) => (
            <InstructorCard
              key={i.id}
              instructor={i}
              subtitle={i.disciplines.slice(0, 2).join(' · ')}
              selected={compare.includes(i.id)}
              onToggleSelect={() => setCompare((c) => (c.includes(i.id) ? c.filter((x) => x !== i.id) : [...c, i.id].slice(-2)))}
            />
          ))}
          <Button
            kind="primary"
            icon="columns"
            label={compare.length === 2 ? 'Compare 2 instructors' : `Select ${2 - compare.length} more to compare`}
            disabled={compare.length !== 2}
            onPress={() => router.push({ pathname: '/explore/compare', params: { a: compare[0], b: compare[1] } })}
          />
        </View>
      )}

      <FilterSheet open={sheetOpen} filters={filters} onClose={() => setSheetOpen(false)} onApply={setFilters} onReset={() => setFilters(defaultFilters(state.prefs))} />
    </Screen>
  );
}

function Pill({ icon, label, onPress }: { icon: 'clock' | 'map-pin'; label: string; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.darkPill}>
      <Icon name={icon} size={16} tint={color.onDark} />
      <Txt variant="bodySmMedium" tint={color.onDark}>
        {label}
      </Txt>
    </Pressable>
  );
}

function FilterSheet({
  open,
  filters,
  onClose,
  onApply,
  onReset,
}: {
  open: boolean;
  filters: ClassFilters;
  onClose: () => void;
  onApply: (f: ClassFilters) => void;
  onReset: () => void;
}) {
  const insets = useSafeAreaInsets();
  const [f, setF] = useState(filters);
  const preview = filterClasses(classes, f, studioOf).length;
  return (
    <Modal visible={open} transparent animationType="slide" onShow={() => setF(filters)} onRequestClose={onClose}>
      <Pressable style={styles.scrim} onPress={onClose} accessibilityLabel="Close filters" />
      <View style={[styles.sheet, { paddingBottom: insets.bottom + space.lg }]}>
        <View style={styles.handle} />
        <View style={[styles.row, { justifyContent: 'space-between', marginBottom: space.md }]}>
          <Txt variant="headingSm">Filters</Txt>
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              onReset();
              onClose();
            }}
          >
            <Txt variant="bodySmMedium" tint={color.primary} underline>
              Reset
            </Txt>
          </Pressable>
        </View>
        <ScrollView style={{ maxHeight: 460 }} contentContainerStyle={{ gap: space.lg, paddingBottom: space.lg }}>
          <Group title="When">
            <ChipGroup<TimeWindow> options={TIME_WINDOWS} selected={f.timeWindow ? [f.timeWindow] : []} onToggle={(v) => setF({ ...f, timeWindow: f.timeWindow === v ? null : v })} />
          </Group>
          <Group title={`Distance · within ${f.maxDistanceMi} mi`}>
            <ChipGroup options={DISTANCE_STEPS.map(String)} selected={[String(f.maxDistanceMi)]} onToggle={(v) => setF({ ...f, maxDistanceMi: Number(v) })} />
          </Group>
          <Group title="Format">
            <ChipGroup options={FORMATS} selected={f.formats} onToggle={(v) => setF({ ...f, formats: toggle(f.formats, v) })} />
          </Group>
          <Group title="Focus area">
            <ChipGroup options={FOCUS} selected={f.focus} onToggle={(v) => setF({ ...f, focus: toggle(f.focus, v) })} />
          </Group>
          <Group title="Felt intensity · how hard it pushed people">
            <ChipGroup options={INTENSITY} selected={f.intensity} onToggle={(v) => setF({ ...f, intensity: toggle(f.intensity, v) })} />
          </Group>
          <Group title="Heated?">
            <Segmented
              options={['Any', 'Heated', 'Not heated'] as const}
              value={f.heated === null ? 'Any' : f.heated ? 'Heated' : 'Not heated'}
              onChange={(v) => setF({ ...f, heated: v === 'Any' ? null : v === 'Heated' })}
            />
          </Group>
          <Group title="Music">
            <ChipGroup options={MUSIC} selected={f.music} onToggle={(v) => setF({ ...f, music: toggle(f.music, v) })} />
          </Group>
          <View style={[styles.row, { justifyContent: 'space-between' }]}>
            <Txt variant="bodySmMedium">Beginner-friendly equipment</Txt>
            <Toggle label="Beginner-friendly equipment" value={f.beginnerFriendly} onChange={(v) => setF({ ...f, beginnerFriendly: v })} />
          </View>
        </ScrollView>
        <Button
          label={preview ? `Show ${preview} ${preview === 1 ? 'class' : 'classes'}` : 'Show results'}
          onPress={() => {
            onApply(f);
            onClose();
          }}
        />
      </View>
    </Modal>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ gap: 10 }}>
      <Txt variant="bodySmMedium">{title}</Txt>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  darkPill: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: color.inverse, borderRadius: radius.pill, paddingHorizontal: 12, height: 36 },
  filterButton: { marginLeft: 'auto', flexDirection: 'row', gap: 8, minHeight: 44, paddingHorizontal: 14, borderRadius: radius.pill, borderWidth: 1, borderColor: color.borderStrong, alignItems: 'center', justifyContent: 'center' },
  count: { minWidth: 22, height: 22, borderRadius: 11, paddingHorizontal: 4, backgroundColor: color.gold, alignItems: 'center', justifyContent: 'center' },
  empty: { width: 96, height: 96, borderRadius: 48, backgroundColor: color.tint, alignItems: 'center', justifyContent: 'center', marginBottom: space.md },
  suggestion: { flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1, borderColor: color.borderStrong, borderRadius: radius.default, paddingHorizontal: 16, height: 60 },
  suggestionCount: { backgroundColor: color.tint, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 4 },
  scrim: { flex: 1, backgroundColor: 'rgba(21,21,21,0.55)' },
  sheet: { backgroundColor: color.canvas, borderTopLeftRadius: 16, borderTopRightRadius: 16, paddingHorizontal: space.xl, paddingTop: space.md },
  handle: { alignSelf: 'center', width: 48, height: 4, borderRadius: 2, backgroundColor: color.borderStrong, marginBottom: space.lg },
});
