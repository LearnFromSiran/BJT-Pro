// BJT Pro — Design System
// A cohesive, professional theme inspired by Japanese business aesthetics:
// deep indigo surfaces, vermilion (朱色) accents, and clean typography.

export const colors = {
  // Backgrounds
  background: '#0E1124',
  backgroundAlt: '#141833',
  surface: '#1B2042',
  surfaceAlt: '#232A52',
  surfaceHigh: '#2C3460',

  // Brand
  primary: '#E63950', // vermilion / 朱色
  primaryDark: '#C42B40',
  primarySoft: 'rgba(230, 57, 80, 0.14)',
  accent: '#36C5F0', // calm sky accent for secondary actions
  accentSoft: 'rgba(54, 197, 240, 0.14)',
  gold: '#F2C14E',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#AEB4D6',
  textMuted: '#6E769E',

  // Semantic
  success: '#3DD68C',
  successSoft: 'rgba(61, 214, 140, 0.16)',
  warning: '#F2C14E',
  danger: '#E63950',

  // Lines
  border: 'rgba(255, 255, 255, 0.08)',
  borderStrong: 'rgba(255, 255, 255, 0.16)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
};

export const typography = {
  display: { fontSize: 30, fontWeight: '800', letterSpacing: 0.2 },
  title: { fontSize: 22, fontWeight: '700' },
  heading: { fontSize: 18, fontWeight: '700' },
  body: { fontSize: 15, fontWeight: '400' },
  bodyStrong: { fontSize: 15, fontWeight: '600' },
  caption: { fontSize: 13, fontWeight: '400' },
  label: { fontSize: 11, fontWeight: '700', letterSpacing: 1 },
};

export const shadow = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
};

export default { colors, spacing, radius, typography, shadow };
