export const DEFAULT_SETTINGS = {
  workDuration: 25,       // minutes
  shortBreakDuration: 5,  // minutes
  longBreakDuration: 15,  // minutes
  pomodorosBeforeLongBreak: 4,
  soundEnabled: true,
  hapticsEnabled: true,
  autoStartBreaks: false,
  autoStartWork: false,
};

export type Settings = typeof DEFAULT_SETTINGS;

export const STORAGE_KEYS = {
  SETTINGS: '@chronr/settings',
  SESSION_LOG: '@chronr/session_log',
  DAILY_COUNT: '@chronr/daily_count',
  THEME: '@chronr/theme',
};
