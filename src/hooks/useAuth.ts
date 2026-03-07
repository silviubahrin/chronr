/**
 * Phase 2 stub — Apple / Google Sign-In
 * Will plug into AuthProvider wrapping the app.
 */
export function useAuth() {
    return {
        user: null,
        isAuthenticated: false,
        signIn: async () => { /* TODO: Phase 2 */ },
        signOut: async () => { /* TODO: Phase 2 */ },
    };
}
