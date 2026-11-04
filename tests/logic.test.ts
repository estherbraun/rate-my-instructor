import { test } from 'node:test';
import assert from 'node:assert/strict';
import { classes, instructors, byId } from '../src/data/mock.ts';
import {
  activeFilterCount,
  dealbreakerFlags,
  defaultFilters,
  filterClasses,
  formatTime,
  matchScore,
  relaxSuggestions,
  studioReviewScore,
  timeWindowOf,
} from '../src/lib/logic.ts';
import type { Preferences } from '../src/data/types.ts';

const maya: Preferences = {
  timeWindows: ['6–7 pm'],
  maxDistanceMi: 1.5,
  formats: ['Yoga', 'HIIT'],
  likedCoaching: ['Calm', 'Detailed form cues'],
  dealbreakers: ['Yells', 'Calls people out', 'Fake "last set"'],
};
const studioOf = (id: string) => byId.studio(id);
const ana = byId.instructor('ana')!;
const leo = byId.instructor('leo')!;

test('formats times like the designs', () => {
  assert.equal(formatTime(18 * 60 + 15), '6:15 pm');
  assert.equal(formatTime(7 * 60), '7:00 am');
  assert.equal(formatTime(12 * 60), '12:00 pm');
});

test('6–7 pm window covers evening classes but not late ones', () => {
  assert.equal(timeWindowOf(18 * 60 + 15), '6–7 pm');
  assert.equal(timeWindowOf(19 * 60), '6–7 pm');
  assert.equal(timeWindowOf(20 * 60), 'Late');
  assert.equal(timeWindowOf(7 * 60), 'Morning');
});

test('match score rewards liked coaching and punishes dealbreakers', () => {
  const a = matchScore(ana, maya);
  const l = matchScore(leo, maya);
  assert.ok(a > 75, `Ana should be a strong match, got ${a}`);
  assert.ok(l < 40, `Leo should be a weak match, got ${l}`);
  for (const i of instructors) {
    const s = matchScore(i, maya);
    assert.ok(s >= 1 && s <= 99);
  }
});

test('dealbreakers are flagged only when attendees actually mention them', () => {
  assert.deepEqual(dealbreakerFlags(ana, maya), []); // 2 of 127 tags = under 5%
  assert.deepEqual(dealbreakerFlags(leo, maya).sort(), ['Calls people out', 'Fake "last set"']);
});

test('default filters come from onboarding preferences', () => {
  const f = defaultFilters(maya);
  assert.equal(f.timeWindow, '6–7 pm');
  assert.equal(f.maxDistanceMi, 1.5);
  assert.equal(activeFilterCount(f), 0);
});

test('Story 1: HIIT, arms & abs, high intensity, not heated, 6–7 pm within 1.5 mi', () => {
  const f = { ...defaultFilters(maya), formats: ['HIIT' as const], focus: ['Arms & abs' as const], intensity: ['High' as const], heated: false };
  const result = filterClasses(classes, f, studioOf);
  assert.deepEqual(result.map((c) => c.id), ['hiit-sculpt']);
  assert.equal(activeFilterCount(f), 4);
});

test('no results always offers ways back, each with a count', () => {
  const f = { ...defaultFilters(maya), formats: ['Barre' as const], heated: false };
  assert.equal(filterClasses(classes, f, studioOf).length, 0);
  const s = relaxSuggestions(classes, f, studioOf);
  assert.ok(s.length > 0);
  for (const sug of s) {
    assert.ok(sug.count > 0);
    assert.equal(filterClasses(classes, sug.filters, studioOf).length, sug.count);
  }
  assert.ok(s.some((x) => x.label.startsWith('Widen to 3 mi')));
});

test('studio review score is independent of the instructor', () => {
  assert.equal(studioReviewScore({ cleanliness: 2, frontDesk: 2, costJustified: 'Somewhat', heatAsExpected: true }), 3);
});
