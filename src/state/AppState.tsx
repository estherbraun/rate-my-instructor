import { createContext, useContext, useMemo, useReducer, type ReactNode } from 'react';
import type { Booking, Preferences, Review } from '@/data/types';

type SavedKind = 'classes' | 'instructors' | 'studios';

export interface AppState {
  onboarded: boolean;
  prefs: Preferences;
  saved: Record<SavedKind, string[]>;
  following: string[];
  syncedFriends: string[];
  bookings: Booking[];
  reviews: Review[];
  goal: { label: string; target: number; done: number };
}

const initialState: AppState = {
  onboarded: false,
  prefs: {
    timeWindows: ['6–7 pm'],
    maxDistanceMi: 1.5,
    formats: ['Yoga', 'HIIT'],
    likedCoaching: ['Calm', 'Detailed form cues'],
    dealbreakers: ['Yells', 'Calls people out', 'Fake "last set"'],
  },
  saved: { classes: ['hot-vinyasa'], instructors: ['ana'], studios: ['light-theory', 'core-house'] },
  following: [],
  syncedFriends: ['roommate'],
  // A class Maya just finished, so the post-class rating prompt (Story 3) has something to rate.
  bookings: [{ id: 'b-hiit-today', classId: 'hiit-sculpt', status: 'attended', verified: true, reviewed: false }],
  reviews: [],
  goal: { label: 'November goal', target: 12, done: 8 },
};

type Action =
  | { type: 'completeOnboarding' }
  | { type: 'setPrefs'; prefs: Preferences }
  | { type: 'toggleSaved'; kind: SavedKind; id: string }
  | { type: 'toggleFollow'; id: string }
  | { type: 'toggleFriend'; id: string }
  | { type: 'book'; classId: string }
  | { type: 'submitReview'; review: Review };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'completeOnboarding':
      return { ...state, onboarded: true };
    case 'setPrefs':
      return { ...state, prefs: action.prefs };
    case 'toggleSaved': {
      const list = state.saved[action.kind];
      const next = list.includes(action.id) ? list.filter((x) => x !== action.id) : [...list, action.id];
      return { ...state, saved: { ...state.saved, [action.kind]: next } };
    }
    case 'toggleFollow':
      return {
        ...state,
        following: state.following.includes(action.id)
          ? state.following.filter((x) => x !== action.id)
          : [...state.following, action.id],
      };
    case 'toggleFriend':
      return {
        ...state,
        syncedFriends: state.syncedFriends.includes(action.id)
          ? state.syncedFriends.filter((x) => x !== action.id)
          : [...state.syncedFriends, action.id],
      };
    case 'book': {
      if (state.bookings.some((b) => b.classId === action.classId && b.status === 'upcoming')) return state;
      const booking: Booking = { id: `b-${action.classId}-${state.bookings.length}`, classId: action.classId, status: 'upcoming', verified: true, reviewed: false };
      return { ...state, bookings: [...state.bookings, booking] };
    }
    case 'submitReview':
      return {
        ...state,
        reviews: [...state.reviews, action.review],
        bookings: state.bookings.map((b) => (b.id === action.review.bookingId ? { ...b, reviewed: true } : b)),
        goal: { ...state.goal, done: Math.min(state.goal.target, state.goal.done + 1) },
      };
    default:
      return state;
  }
}

const Ctx = createContext<{ state: AppState; dispatch: (a: Action) => void } | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useApp must be used inside AppStateProvider');
  return ctx;
}

/** The most recent attended, verified class that still needs a rating (drives the post-class prompt). */
export function usePendingReview(): Booking | undefined {
  const { state } = useApp();
  return state.bookings.find((b) => b.status === 'attended' && !b.reviewed);
}
