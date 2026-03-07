import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DARK_THEME, LIGHT_THEME, ThemeColors } from '../constants/colors';
import { STORAGE_KEYS } from '../constants/defaults';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextValue {
    mode: ThemeMode;
    isDark: boolean;
    colors: ThemeColors;
    setMode: (mode: ThemeMode) => void;
    toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const systemScheme = useColorScheme();
    const [mode, setModeState] = useState<ThemeMode>('dark');

    // Load saved preference
    useEffect(() => {
        AsyncStorage.getItem(STORAGE_KEYS.THEME).then(saved => {
            if (saved === 'light' || saved === 'dark' || saved === 'system') {
                setModeState(saved);
            }
        });
    }, []);

    const setMode = useCallback((m: ThemeMode) => {
        setModeState(m);
        AsyncStorage.setItem(STORAGE_KEYS.THEME, m);
    }, []);

    const toggle = useCallback(() => {
        setMode(mode === 'dark' ? 'light' : 'dark');
    }, [mode, setMode]);

    const isDark =
        mode === 'system'
            ? systemScheme !== 'light'
            : mode === 'dark';

    const colors = isDark ? DARK_THEME : LIGHT_THEME;

    return (
        <ThemeContext.Provider value={{ mode, isDark, colors, setMode, toggle }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme(): ThemeContextValue {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error('useTheme must be inside ThemeProvider');
    return ctx;
}
