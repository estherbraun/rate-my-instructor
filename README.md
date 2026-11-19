# Rate My Instructor

A fitness-class app that rates **instructors and studios separately**, so you know who actually made the class.
Built from the user research, user stories, sitemap and hi-fi wireframes in the Figma file
"Esther Braun – Rate My Instructor – Sitemap & Wireframes" (UX/UI class, BU, Fall 2026).

Styled with the **Red Hat Design System** (tokens, Red Hat Display/Text, radius and spacing rules) in a
luxury-wellness theme: deep spruce (RHDS teal 70–80), gold (RHDS yellow 40), sage (RHDS green 10) and quiet neutrals.

## Project docs

| File | What it is |
|---|---|
| [`SPEC.md`](SPEC.md) | Product spec: problem, persona, user stories with acceptance criteria, screens, data model, business rules, test findings |
| [`AGENTS.md`](AGENTS.md) | How to work in the code: repo map, commands, code and UX rules, definition of done (for coding agents and people) |
| [`.gitignore`](.gitignore) | Keeps dependencies, build output, native folders and secrets out of git |

## Run it

You need [Node.js](https://nodejs.org) 20+ and the **Expo Go** app on your phone.

```bash
npm install
npm start          # scan the QR code with your iPhone camera (opens Expo Go)
npm run web        # or open it in a browser
```

Other scripts:

```bash
npm run typecheck  # TypeScript
npm test           # unit tests for filtering, matching and rating logic
npm run export:web # static web build in dist/
```

## What's in it

| Wireframe | Screen | File |
|---|---|---|
| W01 | Welcome | `src/app/welcome.tsx` |
| W02 | Set preferences (also editable from Profile) | `src/app/onboarding/preferences.tsx` |
| W03 | Sync contacts / friends | `src/app/onboarding/friends.tsx` |
| W04 + W14 | Home, with the post-class rating prompt as a banner | `src/app/(tabs)/index.tsx` |
| W05 W06 W07 W10 | Explore: classes, filters sheet, no-matches suggestions, instructors | `src/app/(tabs)/explore/index.tsx` |
| W08 | Class detail | `src/app/(tabs)/explore/class/[id].tsx` |
| W09 | Booked confirmation | `src/app/(tabs)/explore/booked/[id].tsx` |
| W11 | Instructor profile | `src/app/(tabs)/explore/instructor/[id].tsx` |
| W12 | Compare instructors | `src/app/(tabs)/explore/compare.tsx` |
| W13 | Studio profile | `src/app/(tabs)/explore/studio/[id].tsx` |
| W15 W16 W17 | Rate instructor → rate studio → review posted | `src/app/(tabs)/rate/` |
| W18 | Saved (want to try / favorites) | `src/app/(tabs)/saved.tsx` |
| W19 | Profile, goals, badges | `src/app/(tabs)/profile.tsx` |

The three user stories all work end to end:

1. **Know what you're signing up for** — time + distance come from onboarding; filters for format, focus, felt
   intensity, heat, music and beginner-friendly equipment; "no matches" always offers changes with a class count.
2. **Match the instructor's coaching style** — match % from your liked coaching styles and dealbreakers,
   dealbreakers flagged (never hidden), side-by-side compare.
3. **Quick, separate post-class ratings** — only attended (verified) classes can be rated; instructor and
   studio are scored separately.

## Project structure

```
src/
  app/          screens (Expo Router — every file is a route)
  components/   ui.tsx (RHDS-style button, tag, card, stars…), layout.tsx (screen, headers, tab bar), domain.tsx
  data/         types.ts + mock.ts (sample instructors, studios, classes, friends)
  lib/logic.ts  filtering, match score, no-results suggestions (unit-tested in tests/)
  state/        app state (preferences, saved, bookings, reviews) and the rating draft
  theme/        tokens.ts — RHDS crayon tokens + the wellness semantic layer
```

Screens only use the semantic color names in `src/theme/tokens.ts` (e.g. `color.primary`, `color.gold`),
never raw hex values, so the theme can change in one place.

## Next steps

- Real data: replace `src/data/mock.ts` with an API (e.g. Supabase or Firebase) and real ClassPass deep links.
- Persist state between launches (e.g. `expo-sqlite/kv-store`).
- Push notifications for the post-class prompt (`expo-notifications`).
- Real photography in place of the gradient placeholders.
