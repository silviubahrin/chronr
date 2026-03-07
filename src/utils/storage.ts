import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Load a JSON value from AsyncStorage with a fallback default.
 */
export async function loadJSON<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

/**
 * Save a JSON value to AsyncStorage.
 */
export async function saveJSON<T>(key: string, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('AsyncStorage save error:', e);
  }
}
