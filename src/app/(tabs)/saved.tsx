// W18 · Saved — Want to try (classes + studios, with intro offers) and Favorites (instructors).
import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { Screen } from '@/components/layout';
import { Avatar, Button, Divider, Icon, Photo, Tag, Txt, UnderlineTabs } from '@/components/ui';
import { byId } from '@/data/mock';
import { formatTime, matchScore } from '@/lib/logic';
import { useApp } from '@/state/AppState';
import { color, space } from '@/theme/tokens';

type Row = { key: string; title: string; meta: string; tag?: { label: string; kind: 'gold' | 'tint' }; visual: React.ReactNode; action: string; href: string };

export default function Saved() {
  const { state } = useApp();
  const [tab, setTab] = useState<'Want to try' | 'Favorites'>('Want to try');

  const wantToTry: Row[] = [
    ...state.saved.classes.flatMap((id) => {
      const c = byId.class(id);
      if (!c) return [];
      const s = byId.studio(c.studioId);
      return [{ key: id, title: c.title, meta: `${c.day} ${formatTime(c.start)} · ${s?.name}`, tag: s?.introOffer ? { label: s.introOffer, kind: 'gold' as const } : undefined, visual: <Photo tone={c.tone} height={88} width={88} />, action: 'Book', href: `/explore/class/${id}` }];
    }),
    ...state.saved.studios.flatMap((id) => {
      const s = byId.studio(id);
      if (!s) return [];
      return [{ key: id, title: s.name, meta: `${s.formats[0]} · ${s.distanceMi} mi`, tag: s.introOffer ? { label: s.introOffer, kind: 'gold' as const } : undefined, visual: <Photo tone={s.tone} height={88} width={88} />, action: 'View', href: `/explore/studio/${id}` }];
    }),
  ];
  const favorites: Row[] = Array.from(new Set([...state.saved.instructors, ...state.following])).flatMap((id) => {
    const i = byId.instructor(id);
    if (!i) return [];
    return [{ key: id, title: i.name, meta: i.disciplines.slice(0, 2).join(' · '), tag: { label: `${matchScore(i, state.prefs)}% style match`, kind: 'tint' as const }, visual: <Avatar initials={i.initials} tone={i.tone} size={88} />, action: 'View', href: `/explore/instructor/${id}` }];
  });
  const rows = tab === 'Want to try' ? wantToTry : favorites;

  return (
    <Screen>
      <Txt variant="headingMd" style={{ marginBottom: space.lg }}>
        Saved
      </Txt>
      <UnderlineTabs options={['Want to try', 'Favorites'] as const} value={tab} onChange={setTab} />
      {rows.length === 0 ? (
        <View style={{ alignItems: 'center', gap: 8, marginTop: space['2xl'] }}>
          <Icon name="bookmark" size={32} tint={color.primary} />
          <Txt variant="bodyMdMedium">Nothing saved yet</Txt>
          <Button kind="secondary" size="sm" label="Explore classes" onPress={() => router.navigate('/explore')} />
        </View>
      ) : (
        rows.map((r, idx) => (
          <View key={r.key}>
            <View style={{ flexDirection: 'row', gap: 14, alignItems: 'center', paddingVertical: space.lg }}>
              {r.visual}
              <View style={{ flex: 1, gap: 4 }}>
                <Txt variant="bodyMdMedium" numberOfLines={1}>
                  {r.title}
                </Txt>
                <Txt variant="bodyXs" tint={color.textSecondary}>
                  {r.meta}
                </Txt>
                {r.tag ? <Tag label={r.tag.label} kind={r.tag.kind} /> : null}
              </View>
              <Button size="sm" kind="secondary" label={r.action} onPress={() => router.push(r.href as never)} />
            </View>
            {idx < rows.length - 1 ? <Divider /> : null}
          </View>
        ))
      )}
    </Screen>
  );
}
