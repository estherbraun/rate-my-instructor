import { createContext, useContext, useState, type Dispatch, type ReactNode, type SetStateAction } from 'react';
import type { InstructorReview, StudioReview } from '@/data/types';

/** In-progress rating, shared by the two rating steps (instructor → studio). */
export interface RateDraft {
  bookingId?: string;
  instructor: InstructorReview;
  studio: StudioReview;
}

export const emptyDraft = (bookingId?: string): RateDraft => ({
  bookingId,
  instructor: { effort: 0, music: 0, attitude: 0, tags: [] },
  studio: { cleanliness: 0, frontDesk: 0, amenities: [], costJustified: 'Yes', heatAsExpected: true, comment: '' },
});

const DraftCtx = createContext<[RateDraft, Dispatch<SetStateAction<RateDraft>>] | null>(null);

export function RateDraftProvider({ children }: { children: ReactNode }) {
  const value = useState<RateDraft>(emptyDraft());
  return <DraftCtx.Provider value={value}>{children}</DraftCtx.Provider>;
}

export function useRateDraft() {
  const ctx = useContext(DraftCtx);
  if (!ctx) throw new Error('useRateDraft must be used inside RateDraftProvider');
  return ctx;
}
