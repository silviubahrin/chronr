import React, { createContext, useContext, useEffect, useState } from 'react';
import { DEFAULT_SETTINGS, Settings, STORAGE_KEYS } from '../constants';
import { loadJSON, saveJSON } from '../utils/storage';

interface SettingsContextValue {
  settings: Settings;
  updateSettings: (partial: Partial<Settings>) => void;
  resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  useEffect(() => {
    loadJSON<Settings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS).then(setSettings);
  }, []);

  const updateSettings = (partial: Partial<Settings>) => {
    setSettings(prev => {
      const next = { ...prev, ...partial };
      saveJSON(STORAGE_KEYS.SETTINGS, next);
      return next;
    });
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    saveJSON(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be inside SettingsProvider');
  return ctx;
}
