/**
 * Design tokens.
 *
 * Every color is a Red Hat Design System "crayon" token (https://ux.redhat.com/tokens/color/).
 * The `color` map below is our "Luxury wellness" semantic layer: screens only ever use
 * semantic names, never raw hex values — the same crayon → semantic pattern RHDS uses.
 * These match the variables in the Figma file (page "5 · Style Guide").
 */

export const rhColor = {
  white: '#ffffff',
  gray10: '#f2f2f2',
  gray20: '#e0e0e0',
  gray30: '#c7c7c7',
  gray50: '#707070',
  gray60: '#4d4d4d',
  gray95: '#151515',
  teal10: '#daf2f2',
  teal20: '#b9e5e5',
  teal30: '#9ad8d8',
  teal40: '#63bdbd',
  teal50: '#37a3a3',
  teal60: '#147878',
  teal70: '#004d4d',
  teal80: '#003333',
  yellow10: '#fff4cc',
  yellow40: '#dca614',
  yellow50: '#b98412',
  yellow60: '#96640f',
  green10: '#e9f7df',
  green60: '#3d7317',
  redOrange60: '#b1380b',
} as const;

export const color = {
  // surfaces
  canvas: rhColor.white,
  subtle: rhColor.gray10,
  inverse: rhColor.teal80,
  inverseRaised: rhColor.teal70,
  tint: rhColor.teal10,
  goldTint: rhColor.yellow10,
  sage: rhColor.green10,
  night: rhColor.gray95,
  // text
  text: rhColor.gray95,
  textSecondary: rhColor.gray60,
  textMuted: rhColor.gray50,
  onDark: rhColor.white,
  onDarkMuted: rhColor.teal20,
  textAccent: rhColor.teal60,
  // accents
  primary: rhColor.teal70,
  primaryPressed: rhColor.teal80,
  secondary: rhColor.teal60,
  gold: rhColor.yellow40,
  goldDeep: rhColor.yellow50,
  highlight: rhColor.yellow40, // replaces brand red (too harsh against spruce)
  // status
  positive: rhColor.green60,
  danger: rhColor.redOrange60,
  // borders
  border: rhColor.gray20,
  borderStrong: rhColor.gray30,
} as const;

/** Gradient stand-ins for photography until real imagery exists. */
export const photo = {
  spruce: [rhColor.teal30, rhColor.teal60, rhColor.teal80],
  gold: [rhColor.yellow10, rhColor.yellow40, '#73480b'],
  mist: [rhColor.green10, rhColor.teal40, rhColor.teal70],
  dusk: [rhColor.teal60, rhColor.teal80, rhColor.gray95],
} as const;
export type PhotoTone = keyof typeof photo;

/** RHDS space tokens (px). */
export const space = { xs: 4, sm: 6, md: 8, lg: 16, xl: 24, '2xl': 32, '3xl': 48, '4xl': 64 } as const;

/** RHDS border tokens. */
export const radius = { sharp: 0, default: 3, pill: 64 } as const;
export const borderWidth = { sm: 1, md: 2, lg: 3 } as const;

export const fontFamily = {
  displayLight: 'RedHatDisplay_300Light',
  display: 'RedHatDisplay_400Regular',
  displayMedium: 'RedHatDisplay_500Medium',
  text: 'RedHatText_400Regular',
  textMedium: 'RedHatText_500Medium',
} as const;

/** RHDS type scale (font-size tokens) with RHDS line heights (1.3 headings / 1.5 body). */
export const type = {
  heading2xl: { fontFamily: fontFamily.displayLight, fontSize: 48, lineHeight: 58 },
  headingXl: { fontFamily: fontFamily.display, fontSize: 40, lineHeight: 48 },
  headingMd: { fontFamily: fontFamily.displayMedium, fontSize: 28, lineHeight: 36 },
  headingSm: { fontFamily: fontFamily.displayMedium, fontSize: 24, lineHeight: 31 },
  headingXs: { fontFamily: fontFamily.displayMedium, fontSize: 20, lineHeight: 26 },
  bodyLg: { fontFamily: fontFamily.text, fontSize: 18, lineHeight: 27 },
  bodyMd: { fontFamily: fontFamily.text, fontSize: 16, lineHeight: 24 },
  bodyMdMedium: { fontFamily: fontFamily.textMedium, fontSize: 16, lineHeight: 24 },
  bodySm: { fontFamily: fontFamily.text, fontSize: 14, lineHeight: 21 },
  bodySmMedium: { fontFamily: fontFamily.textMedium, fontSize: 14, lineHeight: 21 },
  bodyXs: { fontFamily: fontFamily.text, fontSize: 12, lineHeight: 18 },
  bodyXsMedium: { fontFamily: fontFamily.textMedium, fontSize: 12, lineHeight: 18 },
  eyebrow: {
    fontFamily: fontFamily.textMedium,
    fontSize: 12,
    lineHeight: 18,
    letterSpacing: 1.2,
    textTransform: 'uppercase' as const,
  },
} as const;
export type TypeVariant = keyof typeof type;
