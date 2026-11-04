/**
 * Base components, built to Red Hat Design System patterns (button, tag, card, avatar, tabs)
 * and styled with the luxury-wellness semantic tokens.
 */
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import type { ComponentProps, ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import { color, photo, radius, type PhotoTone, type TypeVariant, type as typeScale } from '@/theme/tokens';

export type IconName = ComponentProps<typeof Feather>['name'];

export function Icon({ name, size = 22, tint = color.text }: { name: IconName; size?: number; tint?: string }) {
  return <Feather name={name} size={size} color={tint} />;
}

/** Solid gold star used next to ratings. */
export function StarIcon({ size = 14, tint = color.gold }: { size?: number; tint?: string }) {
  return <Ionicons name="star" size={size} color={tint} />;
}

export function Txt({
  variant = 'bodyMd',
  tint = color.text,
  style,
  children,
  numberOfLines,
  center,
  underline,
}: {
  variant?: TypeVariant;
  tint?: string;
  style?: StyleProp<TextStyle>;
  children: ReactNode;
  numberOfLines?: number;
  center?: boolean;
  underline?: boolean;
}) {
  return (
    <Text
      numberOfLines={numberOfLines}
      style={[
        typeScale[variant],
        { color: tint },
        center && { textAlign: 'center' },
        underline && { textDecorationLine: 'underline' },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

type ButtonKind = 'primary' | 'secondary' | 'tertiary' | 'gold' | 'onDark';
const buttonKinds: Record<ButtonKind, { bg?: string; border?: string; fg: string }> = {
  primary: { bg: color.primary, fg: color.onDark },
  secondary: { bg: color.canvas, border: color.primary, fg: color.primary },
  tertiary: { border: color.borderStrong, fg: color.text },
  gold: { bg: color.gold, fg: color.text },
  onDark: { border: color.onDark, fg: color.onDark },
};

export function Button({
  label,
  onPress,
  kind = 'primary',
  size = 'lg',
  icon,
  style,
  disabled,
}: {
  label: string;
  onPress?: () => void;
  kind?: ButtonKind;
  size?: 'lg' | 'sm';
  icon?: IconName;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
}) {
  const k = buttonKinds[kind];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        size === 'sm' && styles.buttonSm,
        { backgroundColor: k.bg ?? 'transparent', borderColor: k.border ?? k.bg ?? 'transparent' },
        pressed && { opacity: 0.85 },
        disabled && { opacity: 0.4 },
        style,
      ]}
    >
      {icon ? <Icon name={icon} size={size === 'sm' ? 16 : 20} tint={k.fg} /> : null}
      <Txt variant={size === 'sm' ? 'bodySmMedium' : 'bodyMdMedium'} tint={k.fg}>
        {label}
      </Txt>
    </Pressable>
  );
}

type TagKind = 'outline' | 'selected' | 'tint' | 'gold' | 'dark' | 'warn';
const tagKinds: Record<TagKind, { bg?: string; border?: string; fg: string }> = {
  outline: { border: color.borderStrong, fg: color.textSecondary },
  selected: { bg: color.primary, fg: color.onDark },
  tint: { bg: color.tint, fg: color.primary },
  gold: { bg: color.goldTint, fg: color.text },
  dark: { bg: color.night, fg: color.onDark },
  warn: { bg: color.goldTint, border: color.goldDeep, fg: color.text },
};

export function Tag({ label, kind = 'outline', onPress }: { label: string; kind?: TagKind; onPress?: () => void }) {
  const k = tagKinds[kind];
  const body = (
    <View style={[styles.tag, { backgroundColor: k.bg ?? 'transparent', borderColor: k.border ?? k.bg ?? 'transparent' }]}>
      <Txt variant="bodyXsMedium" tint={k.fg}>
        {label}
      </Txt>
    </View>
  );
  if (!onPress) return body;
  return (
    <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: kind === 'selected' || kind === 'dark' }} accessibilityLabel={label} onPress={onPress}>
      {body}
    </Pressable>
  );
}

/** Multi-select chip group. `selectedKind` lets dealbreakers render near-black (#151515). */
export function ChipGroup<T extends string>({
  options,
  selected,
  onToggle,
  selectedKind = 'selected',
}: {
  options: readonly T[];
  selected: readonly T[];
  onToggle: (value: T) => void;
  selectedKind?: TagKind;
}) {
  return (
    <View style={styles.wrap}>
      {options.map((o) => (
        <Tag key={o} label={o} kind={selected.includes(o) ? selectedKind : 'outline'} onPress={() => onToggle(o)} />
      ))}
    </View>
  );
}

export function Photo({
  tone,
  label,
  height,
  width,
  round,
  style,
  children,
}: {
  tone: PhotoTone;
  label?: string;
  height: number;
  width?: number | `${number}%`;
  round?: boolean;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
}) {
  return (
    <LinearGradient
      colors={photo[tone]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[{ height, width: width ?? '100%', borderRadius: round ? height / 2 : radius.default, overflow: 'hidden' }, style]}
    >
      <View style={styles.glow} />
      {children}
      {label ? (
        <Txt variant="bodyXsMedium" tint={color.onDark} style={styles.photoLabel}>
          Photo · {label}
        </Txt>
      ) : null}
    </LinearGradient>
  );
}

export function Avatar({ initials, tone = 'spruce', size = 44 }: { initials?: string; tone?: PhotoTone; size?: number }) {
  return (
    <LinearGradient
      colors={tone === 'gold' ? [color.gold, '#96640f'] : ['#37a3a3', color.primary]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ width: size, height: size, borderRadius: size / 2, alignItems: 'center', justifyContent: 'center' }}
    >
      {initials ? (
        <Txt variant={size > 50 ? 'headingXs' : 'bodySmMedium'} tint={color.onDark}>
          {initials}
        </Txt>
      ) : null}
    </LinearGradient>
  );
}

export function Card({ children, style, onPress, highlighted }: { children: ReactNode; style?: StyleProp<ViewStyle>; onPress?: () => void; highlighted?: boolean }) {
  const s = [styles.card, highlighted && { borderColor: color.primary, borderWidth: 1.5 }, style];
  if (!onPress) return <View style={s}>{children}</View>;
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [s, pressed && { backgroundColor: color.subtle }]}>
      {children}
    </Pressable>
  );
}

export function RatingBar({ label, value, accent = color.primary }: { label: string; value: number; accent?: string }) {
  return (
    <View style={styles.barRow} accessibilityLabel={`${label} ${value.toFixed(1)} out of 5`}>
      <Txt variant="bodySm" tint={color.textSecondary} style={{ width: 136 }}>
        {label}
      </Txt>
      <View style={styles.barTrack}>
        <View style={[styles.barFill, { width: `${(value / 5) * 100}%`, backgroundColor: accent }]} />
      </View>
      <Txt variant="bodySmMedium" style={{ width: 34, textAlign: 'right' }}>
        {value.toFixed(1)}
      </Txt>
    </View>
  );
}

export function Stars({ value, onChange, size = 30, label }: { value: number; onChange?: (v: number) => void; size?: number; label: string }) {
  return (
    <View style={[styles.row, { gap: 8 }]} accessibilityRole="radiogroup" accessibilityLabel={`${label}: ${value} of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Pressable
          key={n}
          disabled={!onChange}
          onPress={() => onChange?.(n)}
          accessibilityRole="radio"
          accessibilityState={{ selected: n === value }}
          accessibilityLabel={`${label} ${n} star${n > 1 ? 's' : ''}`}
          hitSlop={4}
        >
          <Ionicons name={n <= value ? 'star' : 'star-outline'} size={size} color={n <= value ? color.gold : color.borderStrong} />
        </Pressable>
      ))}
    </View>
  );
}

/** 1–5 segmented scale ("How hard did this push you?"). */
export function Scale({ value, onChange, low, high }: { value: number; onChange: (v: number) => void; low: string; high: string }) {
  return (
    <View>
      <View style={[styles.row, { gap: 8 }]}>
        {[1, 2, 3, 4, 5].map((n) => {
          const on = n === value;
          return (
            <Pressable
              key={n}
              accessibilityRole="radio"
              accessibilityState={{ selected: on }}
              accessibilityLabel={`${n} of 5`}
              onPress={() => onChange(n)}
              style={[styles.scaleItem, on ? { backgroundColor: color.primary, borderColor: color.primary } : null]}
            >
              <Txt variant="bodyMdMedium" tint={on ? color.onDark : color.text}>
                {n}
              </Txt>
            </Pressable>
          );
        })}
      </View>
      <View style={[styles.row, { justifyContent: 'space-between', marginTop: 6 }]}>
        <Txt variant="bodyXs" tint={color.textMuted}>
          {low}
        </Txt>
        <Txt variant="bodyXs" tint={color.textMuted}>
          {high}
        </Txt>
      </View>
    </View>
  );
}

export function Segmented<T extends string>({ options, value, onChange }: { options: readonly T[]; value: T; onChange: (v: T) => void }) {
  return (
    <View style={[styles.row, { gap: 8 }]}>
      {options.map((o) => {
        const on = o === value;
        return (
          <Pressable
            key={o}
            accessibilityRole="radio"
            accessibilityState={{ selected: on }}
            onPress={() => onChange(o)}
            style={[styles.segment, on && { backgroundColor: color.primary, borderColor: color.primary }]}
          >
            <Txt variant="bodySmMedium" tint={on ? color.onDark : color.text}>
              {o}
            </Txt>
          </Pressable>
        );
      })}
    </View>
  );
}

/** RHDS-style tabs: text labels with an underline on the active tab. */
export function UnderlineTabs<T extends string>({ options, value, onChange }: { options: readonly T[]; value: T; onChange: (v: T) => void }) {
  return (
    <View style={styles.underlineTabs} accessibilityRole="tablist">
      {options.map((o) => {
        const on = o === value;
        return (
          <Pressable key={o} accessibilityRole="tab" accessibilityState={{ selected: on }} onPress={() => onChange(o)} style={[styles.underlineTab, on && styles.underlineTabOn]}>
            <Txt variant={on ? 'bodyMdMedium' : 'bodyMd'} tint={on ? color.primary : color.textSecondary}>
              {o}
            </Txt>
          </Pressable>
        );
      })}
    </View>
  );
}

export function Toggle({ value, onChange, label }: { value: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <Pressable accessibilityRole="switch" accessibilityState={{ checked: value }} accessibilityLabel={label} onPress={() => onChange(!value)} style={[styles.toggle, value && { backgroundColor: color.primary }]}>
      <View style={[styles.knob, value && { alignSelf: 'flex-end' }]} />
    </Pressable>
  );
}

export function IconButton({ name, onPress, label, dark }: { name: IconName; onPress?: () => void; label: string; dark?: boolean }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} hitSlop={8} style={[styles.iconButton, dark && { backgroundColor: color.inverseRaised }]}>
      <Icon name={name} size={20} tint={dark ? color.onDark : color.text} />
    </Pressable>
  );
}

export function SectionHeader({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <View style={[styles.row, { justifyContent: 'space-between', alignItems: 'baseline' }]}>
      <Txt variant="headingXs">{title}</Txt>
      {action ? (
        <Pressable accessibilityRole="link" onPress={onAction} hitSlop={8}>
          <Txt variant="bodySmMedium" tint={color.primary} underline>
            {action}
          </Txt>
        </Pressable>
      ) : null}
    </View>
  );
}

export function Divider({ inset = 0 }: { inset?: number }) {
  return <View style={{ height: 1, backgroundColor: color.border, marginLeft: inset }} />;
}

export function Badge({ label, dark }: { label: string; dark?: boolean }) {
  return (
    <View style={[styles.badge, { backgroundColor: dark ? color.inverse : color.goldTint }]}>
      <Txt variant="bodyXsMedium" tint={dark ? color.gold : color.text}>
        {label}
      </Txt>
    </View>
  );
}

export const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  button: {
    minHeight: 52,
    borderRadius: radius.default,
    borderWidth: 1.5,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  buttonSm: { minHeight: 36, paddingHorizontal: 14 },
  tag: { borderRadius: radius.pill, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 5, alignSelf: 'flex-start' },
  glow: { position: 'absolute', right: -60, top: -80, width: 260, height: 260, borderRadius: 130, backgroundColor: 'rgba(220,166,20,0.18)' },
  photoLabel: { position: 'absolute', left: 14, bottom: 10, opacity: 0.8 },
  card: { backgroundColor: color.canvas, borderRadius: radius.default, borderWidth: 1, borderColor: color.border, padding: 14 },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 3 },
  barTrack: { flex: 1, height: 6, borderRadius: radius.pill, backgroundColor: color.subtle, overflow: 'hidden' },
  barFill: { height: 6, borderRadius: radius.pill },
  scaleItem: { flex: 1, height: 44, borderRadius: radius.default, borderWidth: 1, borderColor: color.borderStrong, alignItems: 'center', justifyContent: 'center' },
  segment: { flex: 1, height: 40, borderRadius: radius.default, borderWidth: 1, borderColor: color.borderStrong, alignItems: 'center', justifyContent: 'center' },
  underlineTabs: { flexDirection: 'row', gap: 28, borderBottomWidth: 1, borderBottomColor: color.border },
  underlineTab: { paddingBottom: 8 },
  underlineTabOn: { borderBottomWidth: 3, borderBottomColor: color.primary, marginBottom: -1 },
  toggle: { width: 48, height: 28, borderRadius: radius.pill, backgroundColor: color.borderStrong, padding: 4, justifyContent: 'center' },
  knob: { width: 20, height: 20, borderRadius: 10, backgroundColor: color.canvas },
  iconButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: color.canvas, alignItems: 'center', justifyContent: 'center' },
  badge: { borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 3, alignSelf: 'flex-start' },
});
