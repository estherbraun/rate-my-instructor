/**
 * Pure product logic (no React, no data imports) so it can be unit-tested with `npm test`.
 */
import type {
  ClassFilters,
  ClassSession,
  CoachingTag,
  Instructor,
  Preferences,
  Studio,
  StudioRatings,
  TimeWindow,
} from '../data/types';

export const TIME_WINDOWS: TimeWindow[] = ['Morning', 'Midday', '6–7 pm', 'Late'];
export const DISTANCE_STEPS = [0.5, 1, 1.5, 3, 5];

/** Which time window a class starting at `start` (minutes after midnight) falls in. */
export function timeWindowOf(start: number): TimeWindow {
  if (start < 11 * 60) return 'Morning';
  if (start < 17 * 60 + 30) return 'Midday';
  if (start <= 19 * 60 + 15) return '6–7 pm';
  return 'Late';
}

export function formatTime(start: number): string {
  const h24 = Math.floor(start / 60);
  const m = start % 60;
  const suffix = h24 >= 12 ? 'pm' : 'am';
  const h = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h}:${m.toString().padStart(2, '0')} ${suffix}`;
}

export function formatRange(start: number, durationMin: number): string {
  return `${formatTime(start).replace(/ (am|pm)$/, '')}–${formatTime(start + durationMin)}`;
}

function share(instructor: Instructor, tags: CoachingTag[]): number {
  const total = instructor.coaching.reduce((sum, t) => sum + t.count, 0);
  if (total === 0) return 0;
  const hits = instructor.coaching.filter((t) => tags.includes(t.tag)).reduce((sum, t) => sum + t.count, 0);
  return hits / total;
}

/**
 * Style match (1–99): rises with how often verified attendees tag the instructor with the
 * coaching styles you like, falls with how often they tag your dealbreakers.
 */
export function matchScore(instructor: Instructor, prefs: Preferences): number {
  const liked = share(instructor, prefs.likedCoaching);
  const disliked = share(instructor, prefs.dealbreakers);
  const raw = 55 + 45 * liked - 70 * disliked;
  return Math.max(1, Math.min(99, Math.round(raw)));
}

/** Dealbreakers that at least 5% of an instructor's tags mention. Flagged, never hidden. */
export function dealbreakerFlags(instructor: Instructor, prefs: Preferences): CoachingTag[] {
  const total = instructor.coaching.reduce((sum, t) => sum + t.count, 0) || 1;
  return instructor.coaching
    .filter((t) => prefs.dealbreakers.includes(t.tag) && t.count / total >= 0.05)
    .map((t) => t.tag);
}

export function defaultFilters(prefs: Preferences): ClassFilters {
  return {
    timeWindow: prefs.timeWindows[0] ?? null,
    maxDistanceMi: prefs.maxDistanceMi,
    formats: [],
    focus: [],
    intensity: [],
    heated: null,
    beginnerFriendly: false,
    music: [],
  };
}

/** Filters beyond time + distance (those are always shown as their own pills). */
export function activeFilterCount(f: ClassFilters): number {
  return (
    f.formats.length +
    f.focus.length +
    f.intensity.length +
    (f.heated === null ? 0 : 1) +
    (f.beginnerFriendly ? 1 : 0) +
    f.music.length
  );
}

type StudioLookup = (id: string) => Studio | undefined;

export function matchesFilters(c: ClassSession, f: ClassFilters, studioOf: StudioLookup): boolean {
  const studio = studioOf(c.studioId);
  if (!studio) return false;
  if (f.timeWindow && timeWindowOf(c.start) !== f.timeWindow) return false;
  if (studio.distanceMi > f.maxDistanceMi) return false;
  if (f.formats.length && !f.formats.includes(c.format)) return false;
  if (f.focus.length && !f.focus.includes(c.focus)) return false;
  if (f.intensity.length && !f.intensity.includes(c.intensity)) return false;
  if (f.heated !== null && c.heated !== f.heated) return false;
  if (f.beginnerFriendly && !c.beginnerFriendly) return false;
  if (f.music.length && !f.music.includes(c.music)) return false;
  return true;
}

export function filterClasses(all: ClassSession[], f: ClassFilters, studioOf: StudioLookup): ClassSession[] {
  return all.filter((c) => matchesFilters(c, f, studioOf)).sort((a, b) => a.start - b.start);
}

export interface Suggestion {
  label: string;
  filters: ClassFilters;
  count: number;
}

/**
 * Edge case from Story 1: when nothing matches, offer the single changes that would bring
 * results back, each with how many classes it unlocks. Never a dead end.
 */
export function relaxSuggestions(all: ClassSession[], f: ClassFilters, studioOf: StudioLookup): Suggestion[] {
  const candidates: { label: string; filters: ClassFilters }[] = [];
  const nextDistance = DISTANCE_STEPS.find((d) => d > f.maxDistanceMi);
  if (nextDistance) candidates.push({ label: `Widen to ${nextDistance} mi`, filters: { ...f, maxDistanceMi: nextDistance } });
  if (f.timeWindow) candidates.push({ label: 'Any time today', filters: { ...f, timeWindow: null } });
  if (f.formats.length) candidates.push({ label: `Any format (not just ${f.formats.join(', ')})`, filters: { ...f, formats: [] } });
  if (f.focus.length) candidates.push({ label: 'Any focus area', filters: { ...f, focus: [] } });
  if (f.intensity.length) candidates.push({ label: 'Any intensity', filters: { ...f, intensity: [] } });
  if (f.heated !== null) candidates.push({ label: f.heated ? 'Allow non-heated rooms' : 'Allow heated rooms', filters: { ...f, heated: null } });
  if (f.beginnerFriendly) candidates.push({ label: 'Any equipment', filters: { ...f, beginnerFriendly: false } });
  if (f.music.length) candidates.push({ label: 'Any music', filters: { ...f, music: [] } });
  return candidates
    .map((c) => ({ ...c, count: filterClasses(all, c.filters, studioOf).length }))
    .filter((s) => s.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);
}

export function studioAverage(r: StudioRatings): number {
  const values = Object.values(r);
  return Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10;
}

export function instructorOverall(i: Instructor): number {
  const { intensity, music, attitude } = i.ratings;
  return Math.round(((intensity + music + attitude) / 3) * 10) / 10;
}

/** Studio score for a single review, on the same 1–5 scale as the instructor score. */
export function studioReviewScore(r: { cleanliness: number; frontDesk: number; costJustified: 'Yes' | 'Somewhat' | 'No'; heatAsExpected: boolean }): number {
  const cost = r.costJustified === 'Yes' ? 5 : r.costJustified === 'Somewhat' ? 3 : 1;
  const heat = r.heatAsExpected ? 5 : 2;
  return Math.round(((r.cleanliness + r.frontDesk + cost + heat) / 4) * 10) / 10;
}
