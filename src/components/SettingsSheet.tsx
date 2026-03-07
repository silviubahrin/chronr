import React, { forwardRef, useCallback, useMemo } from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import Slider from '@react-native-community/slider';
import { useTheme, useSettings } from '../context';

interface SettingRowProps {
    label: string;
    subLabel?: string;
    children: React.ReactNode;
}

function SettingRow({ label, subLabel, children }: SettingRowProps) {
    const { colors } = useTheme();
    return (
        <View style={styles.row}>
            <View style={styles.rowLabel}>
                <Text style={[styles.rowTitle, { color: colors.textPrimary }]}>{label}</Text>
                {subLabel ? <Text style={[styles.rowSub, { color: colors.textSecondary }]}>{subLabel}</Text> : null}
            </View>
            {children}
        </View>
    );
}

interface DurationRowProps {
    label: string;
    value: number;
    min: number;
    max: number;
    step?: number;
    color: string;
    onValueChange: (v: number) => void;
}

function DurationRow({ label, value, min, max, step = 1, color, onValueChange }: DurationRowProps) {
    const { colors } = useTheme();
    return (
        <View style={styles.durationRow}>
            <View style={styles.durationHeader}>
                <Text style={[styles.rowTitle, { color: colors.textPrimary }]}>{label}</Text>
                <Text style={[styles.durationValue, { color }]}>{value} min</Text>
            </View>
            <Slider
                style={styles.slider}
                minimumValue={min}
                maximumValue={max}
                step={step}
                value={value}
                onValueChange={onValueChange}
                minimumTrackTintColor={color}
                maximumTrackTintColor={colors.border}
                thumbTintColor={color}
            />
            <View style={styles.sliderLabels}>
                <Text style={[styles.sliderLabel, { color: colors.textMuted }]}>{min}m</Text>
                <Text style={[styles.sliderLabel, { color: colors.textMuted }]}>{max}m</Text>
            </View>
        </View>
    );
}

const SettingsSheet = forwardRef<BottomSheet>((_, ref) => {
    const { colors } = useTheme();
    const { settings, updateSettings } = useSettings();

    const snapPoints = useMemo(() => ['85%'], []);

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
            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                <Text style={[styles.title, { color: colors.textPrimary }]}>Settings</Text>

                {/* Durations */}
                <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>TIMER DURATIONS</Text>
                <View style={[styles.card, { backgroundColor: colors.bgElevated, borderColor: colors.border }]}>
                    <DurationRow
                        label="Focus"
                        value={settings.workDuration}
                        min={5} max={60} step={5}
                        color={colors.work}
                        onValueChange={v => updateSettings({ workDuration: v })}
                    />
                    <View style={[styles.divider, { backgroundColor: colors.border }]} />
                    <DurationRow
                        label="Short Break"
                        value={settings.shortBreakDuration}
                        min={1} max={15} step={1}
                        color={colors.shortBreak}
                        onValueChange={v => updateSettings({ shortBreakDuration: v })}
                    />
                    <View style={[styles.divider, { backgroundColor: colors.border }]} />
                    <DurationRow
                        label="Long Break"
                        value={settings.longBreakDuration}
                        min={5} max={30} step={5}
                        color={colors.longBreak}
                        onValueChange={v => updateSettings({ longBreakDuration: v })}
                    />
                </View>

                {/* Cycle */}
                <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>CYCLE</Text>
                <View style={[styles.card, { backgroundColor: colors.bgElevated, borderColor: colors.border }]}>
                    <DurationRow
                        label="Before long break"
                        value={settings.pomodorosBeforeLongBreak}
                        min={2} max={8} step={1}
                        color={colors.work}
                        onValueChange={v => updateSettings({ pomodorosBeforeLongBreak: v })}
                    />
                </View>

                {/* Toggles */}
                <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>FEEDBACK</Text>
                <View style={[styles.card, { backgroundColor: colors.bgElevated, borderColor: colors.border }]}>
                    <SettingRow label="Haptics" subLabel="Vibration feedback">
                        <Switch
                            value={settings.hapticsEnabled}
                            onValueChange={v => updateSettings({ hapticsEnabled: v })}
                            trackColor={{ false: colors.border, true: colors.work }}
                            thumbColor={colors.white}
                        />
                    </SettingRow>
                    <View style={[styles.divider, { backgroundColor: colors.border }]} />
                    <SettingRow label="Sound" subLabel="Audio alerts">
                        <Switch
                            value={settings.soundEnabled}
                            onValueChange={v => updateSettings({ soundEnabled: v })}
                            trackColor={{ false: colors.border, true: colors.work }}
                            thumbColor={colors.white}
                        />
                    </SettingRow>
                </View>

                {/* Auto-start */}
                <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>AUTO-START</Text>
                <View style={[styles.card, { backgroundColor: colors.bgElevated, borderColor: colors.border }]}>
                    <SettingRow label="Auto-start breaks" subLabel="Start breaks automatically">
                        <Switch
                            value={settings.autoStartBreaks}
                            onValueChange={v => updateSettings({ autoStartBreaks: v })}
                            trackColor={{ false: colors.border, true: colors.shortBreak }}
                            thumbColor={colors.white}
                        />
                    </SettingRow>
                    <View style={[styles.divider, { backgroundColor: colors.border }]} />
                    <SettingRow label="Auto-start focus" subLabel="Start focus after break">
                        <Switch
                            value={settings.autoStartWork}
                            onValueChange={v => updateSettings({ autoStartWork: v })}
                            trackColor={{ false: colors.border, true: colors.work }}
                            thumbColor={colors.white}
                        />
                    </SettingRow>
                </View>

                {/* Coming Soon */}
                <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>COMING SOON</Text>
                <View style={[styles.card, { backgroundColor: colors.bgElevated, borderColor: colors.border, paddingVertical: 12, gap: 4 }]}>
                    {['🔑  Sign in with Apple / Google', '🏆  Gamification & streaks', '☁️  Cloud sync & history'].map(
                        item => (
                            <Text key={item} style={[styles.comingSoon, { color: colors.textMuted }]}>{item}</Text>
                        )
                    )}
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>
        </BottomSheet>
    );
});

SettingsSheet.displayName = 'SettingsSheet';
export default SettingsSheet;

const styles = StyleSheet.create({
    scroll: { paddingHorizontal: 24, paddingTop: 8 },
    title: { fontSize: 24, fontWeight: '700', letterSpacing: -0.5, marginBottom: 24 },
    sectionTitle: { fontSize: 12, fontWeight: '600', letterSpacing: 1, marginBottom: 10, marginLeft: 4 },
    card: { borderRadius: 16, borderWidth: 1, paddingHorizontal: 16, paddingVertical: 4, marginBottom: 24 },
    row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14 },
    rowLabel: { flex: 1, marginRight: 16 },
    rowTitle: { fontSize: 15, fontWeight: '500' },
    rowSub: { fontSize: 12, marginTop: 2 },
    divider: { height: 1 },
    durationRow: { paddingVertical: 14 },
    durationHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
    durationValue: { fontSize: 16, fontWeight: '700' },
    slider: { width: '100%', height: 36 },
    sliderLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: -4 },
    sliderLabel: { fontSize: 11 },
    comingSoon: { fontSize: 14, paddingVertical: 6 },
});
