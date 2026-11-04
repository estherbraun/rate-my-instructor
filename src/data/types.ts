import type { PhotoTone } from '../theme/tokens';

export type Format = 'Yoga' | 'Hot yoga' | 'Pilates' | 'HIIT' | 'Cycle' | 'Barre';
export type Focus = 'Full body' | 'Arms & abs' | 'Legs' | 'Core' | 'Mobility';
export type Intensity = 'Easy' | 'Medium' | 'High';
export type TimeWindow = 'Morning' | 'Midday' | '6–7 pm' | 'Late';
export type MusicGenre = 'Hip-hop' | 'Pop' | 'House' | 'Lo-fi' | 'Acoustic';

/** Coaching-style tags come straight from the interviews (Ava vs. Ari). */
export type CoachingTag =
  | 'Calm'
  | 'Hype, not yelling'
  | 'Detailed form cues'
  | 'Honest countdowns'
  | 'Tough love'
  | 'Calls people out'
  | 'Yells'
  | 'Fake "last set"';

export const POSITIVE_TAGS: CoachingTag[] = ['Calm', 'Hype, not yelling', 'Detailed form cues', 'Honest countdowns', 'Tough love'];
export const DEALBREAKER_TAGS: CoachingTag[] = ['Yells', 'Calls people out', 'Fake "last set"'];

export interface TagCount {
  tag: CoachingTag;
  count: number;
}

export interface Instructor {
  id: string;
  name: string;
  initials: string;
  disciplines: Format[];
  studioIds: string[];
  coaching: TagCount[];
  music: MusicGenre[];
  playlist: string;
  ratings: { intensity: number; music: number; attitude: number };
  verifiedRaters: number;
  tone: PhotoTone;
}

export interface StudioRatings {
  cleanliness: number;
  frontDesk: number;
  amenities: number;
  parking: number;
  costJustified: number;
  heat: number;
}

export interface Studio {
  id: string;
  name: string;
  neighborhood: string;
  distanceMi: number;
  formats: Format[];
  ratings: StudioRatings;
  amenities: string[];
  introOffer?: string;
  verifiedRaters: number;
  tone: PhotoTone;
}

export interface ClassSession {
  id: string;
  title: string;
  studioId: string;
  instructorId: string;
  format: Format;
  focus: Focus;
  intensity: Intensity;
  /** Average answer to "How hard did this push you?" (1–5). */
  feltIntensity: number;
  heated: boolean;
  beginnerFriendly: boolean;
  equipment: string;
  music: MusicGenre;
  day: string;
  /** Minutes after midnight. */
  start: number;
  durationMin: number;
  friendIds: string[];
  tone: PhotoTone;
}

export interface Friend {
  id: string;
  name: string;
  initials: string;
  note: string;
}

export interface Preferences {
  timeWindows: TimeWindow[];
  maxDistanceMi: number;
  formats: Format[];
  likedCoaching: CoachingTag[];
  dealbreakers: CoachingTag[];
}

export interface ClassFilters {
  timeWindow: TimeWindow | null;
  maxDistanceMi: number;
  formats: Format[];
  focus: Focus[];
  intensity: Intensity[];
  heated: boolean | null;
  beginnerFriendly: boolean;
  music: MusicGenre[];
}

export interface Booking {
  id: string;
  classId: string;
  status: 'upcoming' | 'attended';
  verified: boolean;
  reviewed: boolean;
}

export interface InstructorReview {
  effort: number;
  music: number;
  attitude: number;
  tags: CoachingTag[];
}

export interface StudioReview {
  cleanliness: number;
  frontDesk: number;
  amenities: string[];
  costJustified: 'Yes' | 'Somewhat' | 'No';
  heatAsExpected: boolean;
  comment: string;
}

export interface Review {
  id: string;
  bookingId: string;
  instructor: InstructorReview;
  studio: StudioReview;
  verified: boolean;
  createdAt: string;
}
