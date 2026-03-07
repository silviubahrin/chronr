import React, { forwardRef, useCallback, useMemo } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useTimer } from '../context';
import { getPhaseColor, getPhaseLabel, Phase } from '../constants/colors';
import { formatTimestamp, todayKey } from '../utils/formatTime';
import type { SessionEntry } from '../context';

function SessionItem({ item, colors }: { item: SessionEntry; colors: any }) {
    const color = getPhaseColor(item.phase as Phase, colors);
    const label = getPhaseLabel(item.phase as Phase);
    const mins = Math.round(item.durationSeconds / 60);
    const time = formatTimestamp(new Date(item.completedAt));

    return (
        <View style={[styles.item, { backgroundColor: colors.bgElevated, borderColor: colors.border }]}>
            <View style={[styles.itemDot, { backgroundColor: color }]} />
            <View style={styles.itemContent}>
                <Text style={[styles.itemLabel, { color: colors.textPrimary }]}>{label}</Text>
                <Text style={[styles.itemMeta, { color: colors.textSecondary }]}>{mins} min · {time}</Text>
            </View>
            {item.phase === 'work' && (
                <View style={[styles.badge, { backgroundColor: color + '20' }]}>
                    <Text style={styles.badgeText}>🍅</Text>
                </View>
            )}
        </View>
    );
}

const LogSheet = forwardRef<BottomSheet>((_, ref) => {
    const { colors } = useTheme();
    const { state } = useTimer();

    const snapPoints = useMemo(() => ['75%'], []);
    const today = todayKey();

    const todaySessions = useMemo(
        () =>
            state.sessions.filter(s => {
                const d = new Date(s.completedAt);
                const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                return key === today;
            }),
        [state.sessions, today]
    );

    const workCount = todaySessions.filter(s => s.phase === 'work').length;
    const focusMinutes = todaySessions
        .filter(s => s.phase === 'work')
        .reduce((acc, s) => acc + Math.round(s.durationSeconds / 60), 0);

    const renderBackdrop = useCallback(
        (props: any) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.5} />,
        []
    );

    return (
        <BottomSheet
            ref={ref}
            index={-1}
            snapPoints={snapPoints}
            enablePanDownToClose
            backdropComponent={renderBackdrop}
            backgroundStyle={{ backgroundColor: colors.bgCard }}
            handleIndicatorStyle={{ backgroundColor: colors.textMuted }}
        >
            <View style={styles.content}>
                <Text style={[styles.title, { color: colors.textPrimary }]}>Today</Text>
                <Text style={[styles.date, { color: colors.textSecondary }]}>
                    {new Date().toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}
                </Text>

                {/* Stats */}
                <View style={[styles.statsRow, { backgroundColor: colors.bgElevated, borderColor: colors.border }]}>
                    <View style={styles.statCard}>
                        <Text style={[styles.statValue, { color: colors.work }]}>{workCount}</Text>
                        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Pomodoros</Text>
                    </View>
                    <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
                    <View style={styles.statCard}>
                        <Text style={[styles.statValue, { color: colors.shortBreak }]}>{focusMinutes}</Text>
                        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Focus min</Text>
                    </View>
                    <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
                    <View style={styles.statCard}>
                        <Text style={[styles.statValue, { color: colors.longBreak }]}>{todaySessions.length}</Text>
                        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Sessions</Text>
                    </View>
                </View>

                {/* Session list */}
                {todaySessions.length === 0 ? (
                    <View style={styles.empty}>
                        <Ionicons name="time-outline" size={48} color={colors.textMuted} />
                        <Text style={[styles.emptyTitle, { color: colors.textSecondary }]}>No sessions yet</Text>
                        <Text style={[styles.emptySub, { color: colors.textMuted }]}>Complete a session to see it here</Text>
                    </View>
                ) : (
                    <FlatList
                        data={todaySessions}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => <SessionItem item={item} colors={colors} />}
                        contentContainerStyle={styles.list}
                        showsVerticalScrollIndicator={false}
                        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
                    />
                )}
            </View>
        </BottomSheet>
    );
});

LogSheet.displayName = 'LogSheet';
export default LogSheet;

const styles = StyleSheet.create({
    content: { flex: 1, paddingHorizontal: 24 },
    title: { fontSize: 24, fontWeight: '700', letterSpacing: -0.5 },
    date: { fontSize: 14, marginTop: 2, marginBottom: 20 },
    statsRow: { flexDirection: 'row', borderRadius: 16, padding: 20, marginBottom: 20, borderWidth: 1 },
    statCard: { flex: 1, alignItems: 'center' },
    statValue: { fontSize: 28, fontWeight: '700', letterSpacing: -1 },
    statLabel: { fontSize: 12, marginTop: 2 },
    statDivider: { width: 1, marginVertical: 4 },
    list: { paddingBottom: 32 },
    item: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, borderRadius: 12, borderWidth: 1 },
    itemDot: { width: 10, height: 10, borderRadius: 5 },
    itemContent: { flex: 1 },
    itemLabel: { fontSize: 15, fontWeight: '600' },
    itemMeta: { fontSize: 12, marginTop: 2 },
    badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    badgeText: { fontSize: 14 },
    empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8, paddingBottom: 60 },
    emptyTitle: { fontSize: 18, fontWeight: '600', marginTop: 8 },
    emptySub: { fontSize: 14 },
});
