import React, { useCallback, useEffect, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import BottomSheet from '@gorhom/bottom-sheet';
import { getPhaseColor, getPhaseLabel } from '../constants/colors';
import { useTimer, useTheme, useSettings } from '../context';
import { TimerRing, SessionDots, ControlButtons, ThemeToggle, SettingsSheet, LogSheet } from '../components';
import { formatTime, requestNotificationPermissions } from '../utils';

export default function TimerScreen() {
  const { state, progress, start, pause, resume, reset, skip } = useTimer();
  const { settings } = useSettings();
  const { colors } = useTheme();

  const settingsRef = useRef<BottomSheet>(null);
  const logRef = useRef<BottomSheet>(null);

  // Request notification permissions on first mount
  useEffect(() => {
    requestNotificationPermissions();
  }, []);

  const phase = state.phase;
  const accentColor = getPhaseColor(phase, colors);
  const phaseLabel = getPhaseLabel(phase);
  const cyclePosition = state.cycleCount % settings.pomodorosBeforeLongBreak;

  const openSettings = useCallback(() => settingsRef.current?.snapToIndex(0), []);
  const openLog = useCallback(() => logRef.current?.snapToIndex(0), []);

  // Subtle animated background tint per phase
  const bgStyle = useAnimatedStyle(() => ({
    backgroundColor: withTiming(colors.bg, { duration: 600 }),
  }));

  return (
    <Animated.View style={[styles.root, bgStyle]}>
      <SafeAreaView style={styles.safe}>
        {/* Header — app name + icons */}
        <View style={styles.header}>
          <Text style={[styles.appTitle, { color: colors.textPrimary }]}>chronr</Text>

          <View style={styles.headerRight}>
            <View style={[styles.phasePill, { borderColor: accentColor + '60' }]}>
              <View style={[styles.phaseDot, { backgroundColor: accentColor }]} />
              <Text style={[styles.phaseText, { color: accentColor }]}>{phaseLabel}</Text>
            </View>
            <ThemeToggle />
            <TouchableOpacity
              style={[styles.iconBtn, { backgroundColor: colors.bgElevated, borderColor: colors.border }]}
              onPress={openLog}
              activeOpacity={0.7}
            >
              <Ionicons name="list-outline" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.iconBtn, { backgroundColor: colors.bgElevated, borderColor: colors.border }]}
              onPress={openSettings}
              activeOpacity={0.7}
            >
              <Ionicons name="settings-outline" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Timer Ring */}
        <View style={styles.ringContainer}>
          <TimerRing size={280} strokeWidth={14} progress={progress} color={accentColor}>
            <Text style={[styles.timeDisplay, { color: colors.textPrimary }]}>
              {formatTime(state.remaining)}
            </Text>
            <Text style={[styles.timeLabel, { color: colors.textSecondary }]}>
              {state.status === 'idle'
                ? 'ready'
                : state.status === 'paused'
                  ? 'paused'
                  : phaseLabel.toLowerCase()}
            </Text>
          </TimerRing>
        </View>

        {/* Cycle dots + today count */}
        <View style={styles.dotsRow}>
          <SessionDots
            total={settings.pomodorosBeforeLongBreak}
            completed={cyclePosition}
            activeColor={accentColor}
          />
          <Text style={[styles.todayCount, { color: colors.textMuted }]}>
            {state.todayCount} today
          </Text>
        </View>

        {/* Controls */}
        <View style={styles.controlsContainer}>
          <ControlButtons
            status={state.status}
            accentColor={accentColor}
            onStart={start}
            onPause={pause}
            onResume={resume}
            onReset={reset}
            onSkip={skip}
          />
        </View>

        {/* Phase hint */}
        <Text style={[styles.phaseHint, { color: colors.textMuted }]}>
          {phase === 'work'
            ? `${settings.pomodorosBeforeLongBreak - cyclePosition} until long break`
            : phase === 'shortBreak'
              ? 'Short break — stretch & breathe'
              : 'Long break — you earned it 🎉'}
        </Text>
      </SafeAreaView>

      {/* Bottom sheets */}
      <SettingsSheet ref={settingsRef} />
      <LogSheet ref={logRef} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 24,
    paddingHorizontal: 24,
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  appTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  phasePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  phaseDot: { width: 6, height: 6, borderRadius: 3 },
  phaseText: { fontSize: 12, fontWeight: '600', letterSpacing: 0.3 },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  ringContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeDisplay: {
    fontSize: 64,
    fontWeight: '200',
    letterSpacing: -2,
    fontVariant: ['tabular-nums'],
  },
  timeLabel: {
    fontSize: 13,
    marginTop: 4,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 32,
  },
  todayCount: {
    fontSize: 13,
    fontWeight: '500',
  },
  controlsContainer: {
    marginBottom: 32,
  },
  phaseHint: {
    fontSize: 13,
    textAlign: 'center',
  },
});
