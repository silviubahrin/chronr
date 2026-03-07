/**
 * Phase 4 stub — Cloud sync
 * Will sync local AsyncStorage data to backend when authenticated.
 */
export function useCloud() {
    return {
        isSyncing: false,
        lastSynced: null as Date | null,
        sync: async () => { /* TODO: Phase 4 */ },
    };
}
