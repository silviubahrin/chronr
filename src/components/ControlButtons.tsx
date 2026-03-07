import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context';
import type { TimerStatus } from '../context';

interface ControlButtonsProps {
  status: TimerStatus;
  accentColor: string;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
  onSkip: () => void;
}

export default function ControlButtons({
  status,
  accentColor,
  onStart,
  onPause,
  onResume,
  onReset,
  onSkip,
}: ControlButtonsProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {/* Reset button */}
      <TouchableOpacity
        style={[styles.secondaryBtn, { backgroundColor: colors.bgElevated, borderColor: colors.border }]}
        onPress={onReset}
        activeOpacity={0.7}
      >
        <Ionicons name="refresh" size={22} color={colors.textSecondary} />
      </TouchableOpacity>

      {/* Primary play/pause button */}
      {status === 'idle' && (
        <TouchableOpacity
          style={[styles.primaryBtn, { backgroundColor: accentColor }]}
          onPress={onStart}
          activeOpacity={0.8}
        >
          <Ionicons name="play" size={30} color={colors.white} />
        </TouchableOpacity>
      )}
      {status === 'running' && (
        <TouchableOpacity
          style={[styles.primaryBtn, { backgroundColor: accentColor }]}
          onPress={onPause}
          activeOpacity={0.8}
        >
          <Ionicons name="pause" size={30} color={colors.white} />
        </TouchableOpacity>
      )}
      {status === 'paused' && (
        <TouchableOpacity
          style={[styles.primaryBtn, { backgroundColor: accentColor }]}
          onPress={onResume}
          activeOpacity={0.8}
        >
          <Ionicons name="play" size={30} color={colors.white} />
        </TouchableOpacity>
      )}

      {/* Skip button */}
      <TouchableOpacity
        style={[styles.secondaryBtn, { backgroundColor: colors.bgElevated, borderColor: colors.border }]}
        onPress={onSkip}
        activeOpacity={0.7}
      >
        <Ionicons name="play-skip-forward" size={22} color={colors.textSecondary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  primaryBtn: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  secondaryBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
});
