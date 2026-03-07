import 'react-native-reanimated'; // must be first import
import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { ThemeProvider } from './src/context/ThemeContext';
import { SettingsProvider } from './src/context/SettingsContext';
import { TimerProvider } from './src/context/TimerContext';
import TimerScreen from './src/screens/TimerScreen';

export default function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <ThemeProvider>
          <StatusBarWrapper />
          <SettingsProvider>
            <TimerProvider>
              <TimerScreen />
            </TimerProvider>
          </SettingsProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

// Separate component so it can access ThemeContext
function StatusBarWrapper() {
  // We import useTheme here to avoid circular deps at top level
  const { useTheme } = require('./src/context/ThemeContext');
  const { isDark } = useTheme();
  return <StatusBar style={isDark ? 'light' : 'dark'} />;
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});

// ---------------------------------------------------------------------------
// Future phase stubs — plug in here
// ---------------------------------------------------------------------------

// Phase 2 — Auth
// import { AuthProvider } from './src/context/AuthContext';
// Wrap SettingsProvider with <AuthProvider>

// Phase 3 — Gamification
// import { GamificationProvider } from './src/context/GamificationContext';
// Handles XP, streaks, badges; reads from TimerContext sessions

// Phase 4 — Cloud Sync
// import { SyncProvider } from './src/context/SyncContext';
// Syncs AsyncStorage sessions to backend on auth
