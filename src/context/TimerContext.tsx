import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from 'react';
import { AppState, AppStateStatus } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Phase } from '../constants';
import { useSettings } from './SettingsContext';
import { scheduleTimerNotification, cancelTimerNotification } from '../utils/notifications';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type TimerStatus = 'idle' | 'running' | 'paused';

export interface SessionEntry {
  id: string;
  phase: Phase;
  completedAt: string; // ISO string
  durationSeconds: number;
}

interface TimerState {
  phase: Phase;
  status: TimerStatus;
  remaining: number;       // seconds
  cycleCount: number;      // pomodoros completed this cycle (resets after long break)
  todayCount: number;      // total pomodoros today
  sessions: SessionEntry[];
}

type TimerAction =
  | { type: 'START' }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'RESET' }
  | { type: 'TICK'; remaining: number }
  | { type: 'COMPLETE'; nextPhase: Phase; nextDuration: number }
  | { type: 'ADD_SESSION'; session: SessionEntry }
  | { type: 'SET_PHASE'; phase: Phase; duration: number }
  | { type: 'RESTORE_TODAY'; count: number; sessions: SessionEntry[] };

interface TimerContextValue {
  state: TimerState;
  totalSeconds: number;
  progress: number;        // 0 → 1
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  skip: () => void;
}

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

function buildInitialState(workDuration: number): TimerState {
  return {
    phase: 'work',
    status: 'idle',
    remaining: workDuration * 60,
    cycleCount: 0,
    todayCount: 0,
    sessions: [],
  };
}

function reducer(state: TimerState, action: TimerAction): TimerState {
  switch (action.type) {
    case 'START':
      return { ...state, status: 'running' };
    case 'PAUSE':
      return { ...state, status: 'paused' };
    case 'RESUME':
      return { ...state, status: 'running' };
    case 'RESET':
      return { ...state, status: 'idle' };
    case 'TICK':
      return { ...state, remaining: action.remaining };
    case 'COMPLETE':
      return {
        ...state,
        phase: action.nextPhase,
        status: 'idle',
        remaining: action.nextDuration,
      };
    case 'ADD_SESSION':
      return {
        ...state,
        sessions: [action.session, ...state.sessions].slice(0, 50),
        todayCount: state.phase === 'work' ? state.todayCount + 1 : state.todayCount,
        cycleCount: state.phase === 'work' ? state.cycleCount + 1 : state.cycleCount,
      };
    case 'SET_PHASE':
      return { ...state, phase: action.phase, status: 'idle', remaining: action.duration };
    case 'RESTORE_TODAY':
      return { ...state, todayCount: action.count, sessions: action.sessions };
    default:
      return state;
  }
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const TimerContext = createContext<TimerContextValue | null>(null);

export function TimerProvider({ children }: { children: React.ReactNode }) {
  const { settings } = useSettings();

  const getDuration = useCallback(
    (phase: Phase) => {
      switch (phase) {
        case 'work': return settings.workDuration * 60;
        case 'shortBreak': return settings.shortBreakDuration * 60;
        case 'longBreak': return settings.longBreakDuration * 60;
      }
    },
    [settings]
  );

  const [state, dispatch] = useReducer(reducer, undefined, () =>
    buildInitialState(settings.workDuration)
  );

  // Refs for accurate timing across backgrounds
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const endTimeRef = useRef<number | null>(null);
  const stateRef = useRef(state);
  stateRef.current = state;

  const totalSeconds = getDuration(state.phase);

  // -------------------------------------------------------------------------
  // Advance to next phase after completion
  // -------------------------------------------------------------------------
  const handleComplete = useCallback(() => {
    const { phase, cycleCount } = stateRef.current;

    // Cancel any pending notification
    cancelTimerNotification();

    // Haptic feedback
    if (settings.hapticsEnabled) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    // Log session
    const session: SessionEntry = {
      id: Date.now().toString(),
      phase,
      completedAt: new Date().toISOString(),
      durationSeconds: getDuration(phase),
    };
    dispatch({ type: 'ADD_SESSION', session });

    // Determine next phase
    let nextPhase: Phase;
    if (phase === 'work') {
      const newCycleCount = cycleCount + 1;
      nextPhase =
        newCycleCount % settings.pomodorosBeforeLongBreak === 0
          ? 'longBreak'
          : 'shortBreak';
    } else {
      nextPhase = 'work';
    }

    const nextDuration = getDuration(nextPhase);
    dispatch({ type: 'COMPLETE', nextPhase, nextDuration });

    // Auto-start if configured
    if (
      (nextPhase !== 'work' && settings.autoStartBreaks) ||
      (nextPhase === 'work' && settings.autoStartWork)
    ) {
      endTimeRef.current = Date.now() + nextDuration * 1000;
      dispatch({ type: 'START' });
      // Schedule notification for auto-started session
      const label = nextPhase === 'work' ? 'Focus session' : 'Break';
      scheduleTimerNotification(nextDuration, `${label} complete!`);
    }
  }, [settings, getDuration]);

  // -------------------------------------------------------------------------
  // Interval engine (200ms tick for smooth ring animation)
  // -------------------------------------------------------------------------
  const startInterval = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (!endTimeRef.current) return;
      const rem = Math.ceil((endTimeRef.current - Date.now()) / 1000);
      if (rem <= 0) {
        clearInterval(intervalRef.current!);
        intervalRef.current = null;
        endTimeRef.current = null;
        dispatch({ type: 'TICK', remaining: 0 });
        handleComplete();
      } else {
        dispatch({ type: 'TICK', remaining: rem });
      }
    }, 200);
  }, [handleComplete]);

  const stopInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // -------------------------------------------------------------------------
  // AppState — recalculate remaining on foreground resume
  // -------------------------------------------------------------------------
  useEffect(() => {
    const sub = AppState.addEventListener('change', (next: AppStateStatus) => {
      if (next === 'active' && endTimeRef.current && stateRef.current.status === 'running') {
        const rem = Math.ceil((endTimeRef.current - Date.now()) / 1000);
        if (rem <= 0) {
          stopInterval();
          endTimeRef.current = null;
          dispatch({ type: 'TICK', remaining: 0 });
          handleComplete();
        } else {
          dispatch({ type: 'TICK', remaining: rem });
        }
      }
    });
    return () => sub.remove();
  }, [stopInterval, handleComplete]);

  // -------------------------------------------------------------------------
  // Update remaining when settings change (only when idle)
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (state.status === 'idle') {
      dispatch({ type: 'SET_PHASE', phase: state.phase, duration: getDuration(state.phase) });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.workDuration, settings.shortBreakDuration, settings.longBreakDuration]);

  // -------------------------------------------------------------------------
  // Public controls
  // -------------------------------------------------------------------------
  const start = useCallback(() => {
    const remaining = stateRef.current.remaining;
    endTimeRef.current = Date.now() + remaining * 1000;
    dispatch({ type: 'START' });
    startInterval();
    if (settings.hapticsEnabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    // Schedule background notification
    const phase = stateRef.current.phase;
    const label = phase === 'work' ? 'Focus session' : phase === 'shortBreak' ? 'Short break' : 'Long break';
    scheduleTimerNotification(remaining, `${label} complete! 🍅`);
  }, [startInterval, settings.hapticsEnabled]);

  const pause = useCallback(() => {
    stopInterval();
    endTimeRef.current = null;
    dispatch({ type: 'PAUSE' });
    if (settings.hapticsEnabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    cancelTimerNotification();
  }, [stopInterval, settings.hapticsEnabled]);

  const resume = useCallback(() => {
    const remaining = stateRef.current.remaining;
    endTimeRef.current = Date.now() + remaining * 1000;
    dispatch({ type: 'RESUME' });
    startInterval();
    if (settings.hapticsEnabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const phase = stateRef.current.phase;
    const label = phase === 'work' ? 'Focus session' : 'Break';
    scheduleTimerNotification(remaining, `${label} complete! 🍅`);
  }, [startInterval, settings.hapticsEnabled]);

  const reset = useCallback(() => {
    stopInterval();
    endTimeRef.current = null;
    dispatch({ type: 'RESET' });
    dispatch({ type: 'TICK', remaining: getDuration(stateRef.current.phase) });
    cancelTimerNotification();
  }, [stopInterval, getDuration]);

  const skip = useCallback(() => {
    stopInterval();
    endTimeRef.current = null;
    cancelTimerNotification();
    handleComplete();
  }, [stopInterval, handleComplete]);

  // Cleanup on unmount
  useEffect(() => () => stopInterval(), [stopInterval]);

  const progress = 1 - state.remaining / totalSeconds;

  return (
    <TimerContext.Provider
      value={{ state, totalSeconds, progress, start, pause, resume, reset, skip }}
    >
      {children}
    </TimerContext.Provider>
  );
}

export function useTimer(): TimerContextValue {
  const ctx = useContext(TimerContext);
  if (!ctx) throw new Error('useTimer must be inside TimerProvider');
  return ctx;
}
