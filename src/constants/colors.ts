// ---------------------------------------------------------------------------
// Chronr — Earthy Color Palette
// ---------------------------------------------------------------------------
// Olive Leaf #606c38 | Black Forest #283618 | Cornsilk #fefae0
// Light Caramel #dda15e | Copper #bc6c25

export type Phase = 'work' | 'shortBreak' | 'longBreak';

// ---- Palette tokens ----
const PALETTE = {
  oliveLeaf: '#606c38',
  blackForest: '#283618',
  cornsilk: '#fefae0',
  caramel: '#dda15e',
  copper: '#bc6c25',
  white: '#FFFFFF',
  black: '#000000',
} as const;

// ---- Theme-specific tokens ----
export interface ThemeColors {
  bg: string;
  bgCard: string;
  bgElevated: string;
  border: string;
  work: string;
  workDim: string;
  shortBreak: string;
  shortBreakDim: string;
  longBreak: string;
  longBreakDim: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  ringTrack: string;
  white: string;
  black: string;
  success: string;
}

export const DARK_THEME: ThemeColors = {
  bg: '#0f1a0a',
  bgCard: '#1a2612',
  bgElevated: '#243318',
  border: '#2e3f22',
  work: PALETTE.oliveLeaf,
  workDim: PALETTE.oliveLeaf + '30',
  shortBreak: PALETTE.caramel,
  shortBreakDim: PALETTE.caramel + '30',
  longBreak: PALETTE.copper,
  longBreakDim: PALETTE.copper + '30',
  textPrimary: PALETTE.cornsilk,
  textSecondary: '#b8b5a0',
  textMuted: '#6b6955',
  ringTrack: '#1e2b14',
  white: PALETTE.white,
  black: PALETTE.black,
  success: '#5a9a3c',
};

export const LIGHT_THEME: ThemeColors = {
  bg: PALETTE.cornsilk,
  bgCard: '#f5f0d0',
  bgElevated: '#ece7c7',
  border: '#d5d0b0',
  work: PALETTE.oliveLeaf,
  workDim: PALETTE.oliveLeaf + '20',
  shortBreak: PALETTE.caramel,
  shortBreakDim: PALETTE.caramel + '20',
  longBreak: PALETTE.copper,
  longBreakDim: PALETTE.copper + '20',
  textPrimary: PALETTE.blackForest,
  textSecondary: '#4a5530',
  textMuted: '#8a8a6e',
  ringTrack: '#e2ddc0',
  white: PALETTE.white,
  black: PALETTE.black,
  success: '#4a8a2c',
};

// ---- Phase helpers ----
export function getPhaseColor(phase: Phase, colors: ThemeColors): string {
  switch (phase) {
    case 'work': return colors.work;
    case 'shortBreak': return colors.shortBreak;
    case 'longBreak': return colors.longBreak;
  }
}

export function getPhaseLabel(phase: Phase): string {
  switch (phase) {
    case 'work': return 'Focus';
    case 'shortBreak': return 'Short Break';
    case 'longBreak': return 'Long Break';
  }
}
