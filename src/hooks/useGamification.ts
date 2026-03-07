/**
 * Phase 3 stub — Gamification (XP, streaks, badges)
 * Will read from TimerContext sessions to compute progress.
 */
export function useGamification() {
    return {
        xp: 0,
        level: 1,
        streak: 0,
        badges: [] as string[],
        addXP: (_amount: number) => { /* TODO: Phase 3 */ },
    };
}
