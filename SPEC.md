# Rate My Instructor — Product Specification

| | |
|---|---|
| **Owner** | Esther Braun |
| **Status** | MVP built (Expo app in this repo); final prototype in Figma |
| **Platform** | iOS, Android and web via Expo (SDK 58) and Expo Router |
| **Design source** | Figma file "Esther Braun – Rate My Instructor": page 6 (hi-fi screens), page 8 (final prototype) |
| **Last updated** | November 2026 |

This document says **what** the app must do and **why**. `AGENTS.md` says how to work in the code. When the
two disagree with the code, this spec wins. Update it in the same change whenever behavior changes.

---

## 1. Problem and opportunity

**As-is.** People who take boutique fitness classes pick a class from a studio's star rating on ClassPass or a
studio app. That one rating mixes the room, the front desk and the instructor. The class often turns out to be
the wrong intensity, a heated room they didn't expect, or taught by an instructor who yells or calls people out.
They lose an evening and often never return to the studio.

**To-be.** Before booking, the user can filter classes by what the workout is actually like. They can see how
each instructor coaches, based on tags from people who attended. After class, they rate the instructor and the
studio separately in under a minute. The next person then gets an accurate picture of both.

**Opportunities identified in research**

1. Describe a class by how it feels (intensity, focus, heat, music), not only by format and time.
2. Rate instructors and studios separately, so one doesn't hide the other.
3. Make coaching style visible and comparable, including the user's dealbreakers.

## 2. Target user

**Maya Reyes, 27, works in Back Bay, Boston.** She has about two hours after work and wants one class that fits
tonight. She likes hard workouts that target specific areas, avoids heated rooms, and quits instructors who yell
or call people out. She books through ClassPass and already uses her phone for everything.

## 3. User stories

Each story describes **one feature**.

### US-1 · Filter classes
> As a busy professional, I want to filter classes by workout type, so that I can find one that fits my evening.

**Acceptance criteria**
- **Default view.** Given onboarding preferences (time window and maximum distance), when I open Explore, then
  I see only classes in that time window and within that distance, sorted by start time.
- **Filters.** When I open Filters, then I can filter by format, focus area, intensity, heated or not heated,
  beginner-friendly equipment, and music.
- **Live count.** While I change filters, the apply button shows the live number of matching classes
  ("Show 1 class").
- **Active-filter count.** After I apply filters, the Filters button shows how many filters are active (time and
  distance are not counted, because they show as their own pills).
- **No results.** Given no class matches, when I apply filters, then I see up to 3 one-step changes, each with
  how many classes it brings back, sorted by that count (for example "Allow heated rooms · 2 classes"). The
  screen is never an empty dead end.
- **Book.** Given a class, when I open it, then I see format, focus, heated, equipment, felt intensity,
  instructor, studio and price, and I can book through ClassPass. *(Planned: a confirmation step that shows the
  price and the free-cancellation time before booking, as in the final Figma prototype.)*

### US-2 · Compare instructors' coaching styles
> As a class-goer, I want to compare instructors' coaching styles, so that I can choose one who motivates me.

**Acceptance criteria**
- **Instructor cards.** Each instructor shows a match percentage and the coaching tags verified attendees used
  most.
- **Dealbreakers.** If 5% or more of an instructor's tags are one of my dealbreakers, the card says "Has one of
  your dealbreakers". The instructor is **flagged, never hidden**.
- **Compare.** I can select two instructors and compare them side by side: match, coaching, calls people out,
  honest countdowns, music, felt intensity, attitude and next class. I can book either one from there.
- **Profile.** An instructor's profile shows tag counts, music, ratings and upcoming classes, and I can follow
  them.

### US-3 · Rate the instructor separately from the studio
> As a class attendee, I want to rate the instructor separately from the studio, so that my review is fair to both.

**Acceptance criteria**
- **Prompt.** After a class I attended, Home and the Rate tab prompt me to rate it. I can choose "Rate now" or
  "Tomorrow".
- **Step 1 · Instructor.** I rate how hard the class pushed me (1–5), music (stars), coaching tags and overall
  attitude (stars). Each row fills only when I tap it. **Next** stays disabled until every required row is set.
- **Step 2 · Studio.** I rate cleanliness and front desk (stars), plus optional amenities, whether the cost was
  justified, whether the heat was as expected, and a comment. **Submit** stays disabled until cleanliness and
  front desk are set.
- **Posted.** After posting, I see the instructor score and the studio score separately. The studio score never
  changes the instructor's rating, and the reverse is also true.
- **Verified reviews.** Only classes I actually attended can be rated, so every review is from a verified
  attendee and is labeled that way.

### Supporting features (not user stories, needed to complete the flows)

| Feature | Purpose |
|---|---|
| Onboarding: preferences | Sets the time window, distance, liked formats, liked coaching and dealbreakers used by US-1 and US-2 |
| Onboarding: friends | Optional contacts sync, so friends who took a class show on it |
| Saved | "Want to try" classes and studios, favorite instructors |
| Profile | Monthly class goal, badges, upcoming classes, reviews, edit preferences |

## 4. Scope

**In scope (MVP):** everything in section 3, using local mock data, on iOS, Android and web.

**Out of scope for now:**
- real accounts and sign-in
- a backend or API
- real ClassPass booking (booking is simulated)
- push notifications
- payments
- studio or instructor dashboards
- moderation of reviews

## 5. Screens and routes

| Route (`src/app/…`) | Screen | Wireframe | Story |
|---|---|---|---|
| `welcome.tsx` | Welcome | W01 | — |
| `onboarding/preferences.tsx` | Set preferences | W02 | US-1, US-2 |
| `onboarding/friends.tsx` | Sync friends | W03 | — |
| `(tabs)/index.tsx` | Home, plus the post-class prompt | W04, W14 | US-3 |
| `(tabs)/explore/index.tsx` | Classes, filters sheet, no matches, instructors list | W05, W06, W07, W10 | US-1, US-2 |
| `(tabs)/explore/class/[id].tsx` | Class detail and booking confirmation | W08 | US-1 |
| `(tabs)/explore/booked/[id].tsx` | Booked | W09 | US-1 |
| `(tabs)/explore/instructor/[id].tsx` | Instructor profile | W11 | US-2 |
| `(tabs)/explore/compare.tsx` | Compare two instructors | W12 | US-2 |
| `(tabs)/explore/studio/[id].tsx` | Studio profile | W13 | US-2 |
| `(tabs)/rate/index.tsx` | Classes to rate | — | US-3 |
| `(tabs)/rate/instructor.tsx` | Rate instructor (step 1 of 2) | W15 | US-3 |
| `(tabs)/rate/studio.tsx` | Rate studio (step 2 of 2) | W16 | US-3 |
| `(tabs)/rate/posted.tsx` | Review posted | W17 | US-3 |
| `(tabs)/saved.tsx` | Saved | W18 | — |
| `(tabs)/profile.tsx` | Profile and goals | W19 | — |

The tab bar is always visible inside the app: Home · Explore · **Rate** (center action) · Saved · Profile.

## 6. Data model

Types live in `src/data/types.ts`. Mock data lives in `src/data/mock.ts`.

| Entity | Key fields |
|---|---|
| `Instructor` | `coaching: {tag, count}[]` from verified attendees; `ratings {intensity, music, attitude}`; `studioIds` |
| `Studio` | `distanceMi`; `ratings {cleanliness, frontDesk, amenities, parking, costJustified, heat}`; `introOffer` |
| `ClassSession` | `format`, `focus`, `intensity`, `feltIntensity` (1–5), `heated`, `beginnerFriendly`, `music`, `start` (minutes after midnight), `durationMin` |
| `Preferences` | `timeWindows`, `maxDistanceMi`, `formats`, `likedCoaching`, `dealbreakers` |
| `ClassFilters` | `timeWindow`, `maxDistanceMi`, `formats[]`, `focus[]`, `intensity[]`, `heated: boolean or null`, `beginnerFriendly`, `music[]` |
| `Booking` | `status: upcoming or attended`, `verified`, `reviewed` |
| `Review` | `instructor {effort, music, attitude, tags}`, `studio {cleanliness, frontDesk, amenities, costJustified, heatAsExpected, comment}` and `verified` |

## 7. Business rules

All rules are pure functions in `src/lib/logic.ts` and are unit-tested in `tests/logic.test.ts`.

| Rule | Definition |
|---|---|
| Time windows | Morning < 11:00 · Midday < 17:30 · **6–7 pm** up to 19:15 · Late after that |
| Filtering | A class must pass every active filter. An empty list means "any". `heated: null` means "any". Results are sorted by start time. |
| Active-filter count | Formats + focus + intensity + music selections, plus 1 for heated and 1 for beginner-friendly when set. Time and distance are not counted. |
| No-results suggestions | Try removing one constraint at a time (distance widens to the next step: 0.5, 1, 1.5, 3, 5 mi). Keep the suggestions that return at least one class, sorted by count, top 3. |
| Match score | `55 + 45 × (share of tags the user likes) − 70 × (share of the user's dealbreaker tags)`, rounded and clamped to 1–99 |
| Dealbreaker flag | A dealbreaker tag that makes up 5% or more of an instructor's tags. Shown as a warning, never used to hide the instructor. |
| Studio review score | Average of cleanliness, front desk, cost (Yes = 5, Somewhat = 3, No = 1) and heat (as expected = 5, otherwise 2), to one decimal |
| Instructor review score | Average of music and attitude, to one decimal. Never mixed with the studio score. |

## 8. Non-functional requirements

- **Mobile first.** Designed for a 390 × 844 pt phone. One-handed use, with the primary action in the footer.
- **Touch targets.** At least 44 × 44 pt.
- **Accessibility.** Every control has an accessibility role and label. Checkboxes and toggles expose their state.
  Text meets WCAG AA contrast.
- **Consistency.** The same tab bar, header patterns, buttons, tags and cards are used on every screen.
- **Theming.** Screens use only the semantic tokens in `src/theme/tokens.ts` (Red Hat Design System palette in a
  wellness theme: spruce, gold, sage). No raw hex values in screens.
- **Feedback.** Every tap that changes something gives visible feedback: a state change, a confirmation screen or
  a short message.
- **Performance.** Screens render from local data with no loading states longer than a frame. Filtering runs on
  the device.
- **Privacy.** No real personal data. Contacts sync is simulated.

## 9. Changes from usability testing

Testing used the Figma prototype (page 7 is the tested version, page 8 is the final version).

| Finding | Change | Status in app |
|---|---|---|
| The filter icon was easy to miss; the participant scrolled the class list instead | Labeled **Filters** button that shows the active-filter count | **Planned:** the app shows an icon-only button with an accessibility label |
| One tap filled every rating row, so participants couldn't give their own scores | Each rating row fills only when tapped; Next and Submit unlock when the required rows are set | **Done** (`complete` check in `rate/instructor.tsx` and `rate/studio.tsx`) |
| Cards for other instructors' classes opened the wrong class | Every class, instructor and studio card opens its own detail screen | **Done** (routes use `[id]`) |
| Save, share and add-to-calendar gave no feedback | Short confirmation message after each action | **Planned** |

## 10. Definition of done

A change is done when:
1. `npm run typecheck` passes.
2. `npm test` passes, with a new or updated test for any change to `src/lib/logic.ts`.
3. The affected flow works end to end in Expo Go or on the web (`npm run web`).
4. This spec is updated if behavior changed.

## 11. Open questions

- Real booking: ClassPass deep links or a partner API?
- Review verification: how is attendance confirmed without a ClassPass integration?
- Should the dealbreaker threshold (5%) be user-adjustable?
