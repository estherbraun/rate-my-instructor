/**
 * Sample data for development. Names are fictional; studios are placeholders in Boston
 * neighborhoods. Replace with an API later.
 */
import type { ClassSession, Friend, Instructor, Studio } from './types';

export const studios: Studio[] = [
  {
    id: 'form',
    name: 'Form Studio',
    neighborhood: 'Back Bay',
    distanceMi: 0.8,
    formats: ['HIIT', 'Pilates', 'Hot yoga'],
    ratings: { cleanliness: 4.2, frontDesk: 3.1, amenities: 3.5, parking: 2.0, costJustified: 3.8, heat: 4.0 },
    amenities: ['Showers', 'Lockers'],
    introOffer: 'Intro: $50 unlimited first month',
    verifiedRaters: 128,
    tone: 'mist',
  },
  {
    id: 'light-theory',
    name: 'Light Theory Yoga',
    neighborhood: 'South End',
    distanceMi: 0.6,
    formats: ['Yoga', 'Hot yoga'],
    ratings: { cleanliness: 4.7, frontDesk: 4.5, amenities: 4.4, parking: 2.5, costJustified: 4.1, heat: 4.6 },
    amenities: ['Showers', 'Free water', 'Lockers'],
    introOffer: 'First class free',
    verifiedRaters: 96,
    tone: 'spruce',
  },
  {
    id: 'pulse',
    name: 'Pulse Boston',
    neighborhood: 'Fenway',
    distanceMi: 1.1,
    formats: ['HIIT', 'Cycle'],
    ratings: { cleanliness: 3.9, frontDesk: 4.2, amenities: 3.0, parking: 3.4, costJustified: 3.6, heat: 3.8 },
    amenities: ['Free water', 'Lockers'],
    verifiedRaters: 71,
    tone: 'gold',
  },
  {
    id: 'core-house',
    name: 'Core House',
    neighborhood: 'Cambridge',
    distanceMi: 2.6,
    formats: ['Pilates', 'Barre'],
    ratings: { cleanliness: 4.5, frontDesk: 4.0, amenities: 4.2, parking: 3.0, costJustified: 3.9, heat: 4.3 },
    amenities: ['Showers', 'Free water'],
    introOffer: 'Intro: $10 first class',
    verifiedRaters: 54,
    tone: 'dusk',
  },
];

export const instructors: Instructor[] = [
  {
    id: 'ana',
    name: 'Ana Torres',
    initials: 'AT',
    disciplines: ['Yoga', 'Pilates', 'HIIT'],
    studioIds: ['form', 'light-theory'],
    coaching: [
      { tag: 'Calm', count: 38 },
      { tag: 'Detailed form cues', count: 41 },
      { tag: 'Honest countdowns', count: 29 },
      { tag: 'Hype, not yelling', count: 17 },
      { tag: 'Calls people out', count: 2 },
    ],
    music: ['Lo-fi', 'Acoustic'],
    playlist: 'Slow-flow lo-fi',
    ratings: { intensity: 3.8, music: 4.4, attitude: 4.7 },
    verifiedRaters: 46,
    tone: 'gold',
  },
  {
    id: 'leo',
    name: 'Leo Park',
    initials: 'LP',
    disciplines: ['HIIT', 'Cycle', 'Yoga'],
    studioIds: ['pulse', 'form'],
    coaching: [
      { tag: 'Hype, not yelling', count: 22 },
      { tag: 'Tough love', count: 18 },
      { tag: 'Calls people out', count: 19 },
      { tag: 'Fake "last set"', count: 9 },
    ],
    music: ['Hip-hop', 'House'],
    playlist: 'Peak-hour hip-hop',
    ratings: { intensity: 4.6, music: 4.5, attitude: 4.1 },
    verifiedRaters: 63,
    tone: 'spruce',
  },
  {
    id: 'mia',
    name: 'Mia Chen',
    initials: 'MC',
    disciplines: ['Pilates', 'Barre', 'Yoga'],
    studioIds: ['core-house', 'light-theory'],
    coaching: [
      { tag: 'Calm', count: 24 },
      { tag: 'Detailed form cues', count: 15 },
      { tag: 'Honest countdowns', count: 12 },
    ],
    music: ['Lo-fi', 'Pop'],
    playlist: 'Sunday reset',
    ratings: { intensity: 3.4, music: 4.0, attitude: 4.6 },
    verifiedRaters: 31,
    tone: 'mist',
  },
];

const t = (h: number, m = 0) => h * 60 + m;

export const classes: ClassSession[] = [
  { id: 'hiit-sculpt', title: 'HIIT Sculpt', studioId: 'form', instructorId: 'ana', format: 'HIIT', focus: 'Arms & abs', intensity: 'High', feltIntensity: 4.5, heated: false, beginnerFriendly: true, equipment: 'Dumbbells, bench', music: 'Lo-fi', day: 'Today', start: t(18, 15), durationMin: 45, friendIds: ['sam', 'priya'], tone: 'spruce' },
  { id: 'power-circuit', title: 'Power Circuit', studioId: 'pulse', instructorId: 'leo', format: 'HIIT', focus: 'Full body', intensity: 'High', feltIntensity: 4.7, heated: false, beginnerFriendly: false, equipment: 'Kettlebells, rower', music: 'Hip-hop', day: 'Today', start: t(18, 30), durationMin: 50, friendIds: [], tone: 'gold' },
  { id: 'sculpt-45', title: 'Sculpt 45', studioId: 'core-house', instructorId: 'mia', format: 'Barre', focus: 'Arms & abs', intensity: 'Medium', feltIntensity: 3.6, heated: false, beginnerFriendly: true, equipment: 'Light weights, ball', music: 'Pop', day: 'Today', start: t(19, 0), durationMin: 45, friendIds: ['jordan'], tone: 'mist' },
  { id: 'hot-vinyasa', title: 'Hot Vinyasa', studioId: 'light-theory', instructorId: 'ana', format: 'Hot yoga', focus: 'Mobility', intensity: 'Medium', feltIntensity: 3.9, heated: true, beginnerFriendly: true, equipment: 'Mat (provided)', music: 'Acoustic', day: 'Today', start: t(18, 0), durationMin: 60, friendIds: [], tone: 'dusk' },
  { id: 'sunrise-flow', title: 'Sunrise Flow', studioId: 'light-theory', instructorId: 'mia', format: 'Yoga', focus: 'Mobility', intensity: 'Easy', feltIntensity: 2.4, heated: false, beginnerFriendly: true, equipment: 'Mat (provided)', music: 'Lo-fi', day: 'Today', start: t(7, 0), durationMin: 50, friendIds: [], tone: 'mist' },
  { id: 'reformer-core', title: 'Reformer Core', studioId: 'form', instructorId: 'ana', format: 'Pilates', focus: 'Core', intensity: 'Medium', feltIntensity: 3.7, heated: false, beginnerFriendly: false, equipment: 'Reformer', music: 'Lo-fi', day: 'Tue', start: t(16, 30), durationMin: 50, friendIds: ['sam'], tone: 'spruce' },
  { id: 'rhythm-ride', title: 'Rhythm Ride', studioId: 'pulse', instructorId: 'leo', format: 'Cycle', focus: 'Legs', intensity: 'High', feltIntensity: 4.4, heated: false, beginnerFriendly: true, equipment: 'Bike, clip-in shoes', music: 'House', day: 'Today', start: t(20, 0), durationMin: 45, friendIds: ['priya'], tone: 'gold' },
  { id: 'hot-power', title: 'Hot Power Yoga', studioId: 'form', instructorId: 'leo', format: 'Hot yoga', focus: 'Full body', intensity: 'High', feltIntensity: 4.2, heated: true, beginnerFriendly: false, equipment: 'Mat, towel', music: 'Hip-hop', day: 'Tue', start: t(16, 30), durationMin: 60, friendIds: [], tone: 'dusk' },
];

export const friends: Friend[] = [
  { id: 'roommate', name: 'Roommate', initials: 'RM', note: 'Goes to every class with you' },
  { id: 'sam', name: 'Sam Rivera', initials: 'SR', note: 'Rated 6 classes · 3 studios in common' },
  { id: 'priya', name: 'Priya Shah', initials: 'PS', note: 'On Rate My Instructor' },
  { id: 'jordan', name: 'Jordan Kim', initials: 'JK', note: 'On Rate My Instructor' },
];

export const byId = {
  studio: (id: string) => studios.find((s) => s.id === id),
  instructor: (id: string) => instructors.find((i) => i.id === id),
  class: (id: string) => classes.find((c) => c.id === id),
  friend: (id: string) => friends.find((f) => f.id === id),
};
