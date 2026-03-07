# Chronr — Pomodoro Timer by spacr.xyz

A precision-engineered Pomodoro timer app built with Expo + React Native.

## Setup

```bash
npm install
npx expo start
```

## Architecture

- **Timer Engine**: Epoch-based interval with `AppState` API for background accuracy
- **Notifications**: `expo-notifications` fires alarms even when phone is locked
- **State**: `useReducer` + React Context (TimerContext, SettingsContext, ThemeContext)
- **UI**: Single-screen layout with `@gorhom/bottom-sheet` modals for Settings & Log
- **Animation**: `react-native-reanimated` for 60fps timer ring
- **Persistence**: `AsyncStorage` for settings, sessions, and theme preference

## Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| Olive Leaf | `#606c38` | Focus/work accent |
| Black Forest | `#283618` | Dark theme base |
| Cornsilk | `#fefae0` | Light theme base |
| Light Caramel | `#dda15e` | Short break accent |
| Copper | `#bc6c25` | Long break accent |

## Roadmap

- **Phase 1** ✅ MVP — Timer, Settings, Log, Light/Dark theme
- **Phase 2** — Apple / Google Sign-In
- **Phase 3** — Gamification (XP, streaks, badges)
- **Phase 4** — Cloud sync & cross-device history
