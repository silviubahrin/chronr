import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// Configure notification handler (show even when app is in foreground)
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

const TIMER_NOTIFICATION_ID = 'chronr-timer';

/**
 * Request notification permissions. Call once on app startup.
 */
export async function requestNotificationPermissions(): Promise<boolean> {
    if (!Device.isDevice) {
        // Notifications may not work perfectly on emulator, but we still allow scheduling
        console.log('Notifications: running on emulator, permissions may be limited');
    }

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('timer', {
            name: 'Timer Alerts',
            importance: Notifications.AndroidImportance.HIGH,
            sound: 'default',
            vibrationPattern: [0, 250, 250, 250],
        });
    }

    const { status: existing } = await Notifications.getPermissionsAsync();
    let finalStatus = existing;

    if (existing !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    return finalStatus === 'granted';
}

/**
 * Schedule a local notification to fire after `seconds` seconds.
 * This is the key feature: even if the app is killed or phone is locked,
 * the OS will deliver this notification at the exact time.
 */
export async function scheduleTimerNotification(
    seconds: number,
    body: string
): Promise<void> {
    // Cancel any existing timer notification first
    await cancelTimerNotification();

    try {
        await Notifications.scheduleNotificationAsync({
            identifier: TIMER_NOTIFICATION_ID,
            content: {
                title: 'Chronr',
                body,
                sound: 'default',
                ...(Platform.OS === 'android' ? { channelId: 'timer' } : {}),
            },
            trigger: {
                seconds,
            },
        });
    } catch (e) {
        console.warn('Failed to schedule notification:', e);
    }
}

/**
 * Cancel the pending timer notification (on pause/reset/complete).
 */
export async function cancelTimerNotification(): Promise<void> {
    try {
        await Notifications.cancelScheduledNotificationAsync(TIMER_NOTIFICATION_ID);
    } catch {
        // Ignore if no notification was scheduled
    }
}
