# AGENTS.md — working in Rate My Instructor

Instructions for coding agents (and people) changing this repo. Read this file and `SPEC.md` before you write
code. `SPEC.md` defines **what** the app does; this file defines **how** to change it.

## What this is

An Expo / React Native app (SDK 58, Expo Router) that helps people pick fitness classes and rate the
**instructor separately from the studio**. It is built from the Figma hi-fi screens and final prototype by
Esther Braun. Data is local mock data; there is no backend.

## Before you start

1. Read `SPEC.md`, especially the user story you are touching (US-1 filter classes, US-2 compare instructors,
   US-3 rate instructor separately from studio) and its acceptance criteria.
2. Find the screen in the routes table (`SPEC.md` §5) and the rule in `SPEC.md` §7.
3. Make the smallest change that meets the acceptance criteria. Don't refactor unrelated code.

## Repo map

```
src/app/          Screens. Every file is a route (Expo Router). _layout.tsx files define navigators.
  (tabs)/         Home, Explore (classes, class/[id], booked/[id], instructor/[id], studio/[id], compare),
                  Rate (index, instructor, studio, posted), Saved, Profile
  onboarding/     preferences, friends
  welcome.tsx
src/components/   ui.tsx (shared RHDS-style controls), layout.tsx (Screen, headers, tab bar),
                  domain.tsx (ClassCard, InstructorCard)
src/data/         types.ts (domain types), mock.ts (sample instructors, studios, classes, friends)
src/lib/logic.ts  Pure product rules: filtering, match score, dealbreakers, suggestions, review scores
src/state/        AppState.tsx (preferences, saved, bookings, reviews, follows), RateDraft.tsx (rating draft)
src/theme/        tokens.ts (Red Hat Design System colors, type, spacing, radius → semantic names)
tests/            logic.test.ts (node:test, run with npm test)
```

## Commands

```bash
npm install
npm start            # Expo dev server; scan the QR code with Expo Go
npm run web          # run in the browser
npm run typecheck    # tsc --noEmit
npm test             # unit tests for src/lib/logic.ts
npm run export:web   # static web build in dist/ (do not commit dist/)
npx expo install <package>   # ALWAYS use this to add dependencies (SDK-compatible versions)
```

## Code rules

- **Product rules go in `src/lib/logic.ts`** as pure functions (no React, no imports from `mock.ts`), with a test
  in `tests/logic.test.ts`. Screens call these functions; they don't reimplement rules.
- **Styling uses semantic tokens only.** Import `color`, `space`, `radius` from `@/theme/tokens`. Never write raw
  hex values or font names in screens. Fonts are Red Hat Display (headings) and Red Hat Text (body).
- **Reuse components** from `src/components/ui.tsx` (Button, Tag, ChipGroup, Card, Stars, Scale, Segmented,
  Toggle, Badge…) and `layout.tsx` (Screen, BackHeader, StepProgress, WellnessTabBar) before making new ones.
  Every screen except Welcome uses `Screen`; screens inside `(tabs)` keep the tab bar.
- **State** changes go through the reducer in `src/state/AppState.tsx` (`dispatch({ type: … })`). Rating input
  goes through `RateDraft`.
- **Types**: keep `src/data/types.ts` as the single source of domain types. TypeScript strict; no `any`.
- **Import alias**: use `@/…` for anything under `src/`.

## UX rules (from the spec and usability testing)

- Touch targets are at least 44 × 44 pt. The primary action sits in the screen footer.
- Every control has `accessibilityRole` and `accessibilityLabel`. Checkboxes and toggles also set
  `accessibilityState`.
- Never leave a dead end: an empty result shows suggestions (`relaxSuggestions`), and every action gives visible
  feedback.
- Dealbreakers are **flagged, never hidden**.
- Instructor and studio scores stay separate everywhere. Never combine them into one number.
- Required inputs disable the primary button until they are filled. Don't auto-fill a user's ratings.

## Expo has changed — do not trust your training data

Expo ships breaking changes every SDK release. Before writing code that touches an Expo, EAS or React Native API:

1. Read the major version of `expo` in `package.json` (currently 58).
2. Fetch the matching docs: `https://docs.expo.dev/versions/v58.0.0/`
3. For anything else, fetch https://docs.expo.dev/llms.txt and follow its links. Never answer from memory.

Other Expo rules:
- `ios/` and `android/` are generated (Continuous Native Generation). Never create or edit them; configure
  native behavior in `app.json` and config plugins.
- Expo Go only includes its bundled native modules. A library with native code needs a development build
  (`npx expo run:ios|android` or `eas build --profile development`).
- Prefer Expo modules over third-party libraries. Docs: https://docs.expo.dev/versions/latest/index.md
- EAS (`npx eas-cli@latest build|submit|update`) builds and ships the app in the cloud.

## Definition of done

1. `npm run typecheck` passes.
2. `npm test` passes, with new or updated tests for any change to `src/lib/logic.ts`.
3. The affected flow works end to end in Expo Go or on the web.
4. `SPEC.md` is updated if behavior changed (including the status column in §9).
5. Commits are small and say what changed and which user story it serves, for example
   `US-1: show active filter count on the Filters button`.

## Don't

- Don't add a backend, sign-in or real payments; they are out of scope (`SPEC.md` §4).
- Don't commit secrets, `.env` files, `node_modules/`, `.expo/` or `dist/` (all are in `.gitignore`).
- Don't change the meaning of a user story without updating `SPEC.md` first.
