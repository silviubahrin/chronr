import React, { forwardRef, useCallback, useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useTimer } from '../context';
import { getPhaseColor, getPhaseLabel } from '../constants/colors';
import { Phase } from '../constants';

const PhaseSwitcherSheet = forwardRef<BottomSheet>((_, ref) => {
    const { colors } = useTheme();
    const { state, setPhase } = useTimer();

    const snapPoints = useMemo(() => ['40%'], []);

    const renderBackdrop = useCallback(
        (props: any) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.5} />,
        []
    );

    const handleSelect = (phase: Phase) => {
        setPhase(phase);
        // @ts-ignore
        ref.current?.close();
    };

    const Option = ({ phase, icon }: { phase: Phase; icon: keyof typeof Ionicons.glyphMap }) => {
        const isActive = state.phase === phase;
        const color = getPhaseColor(phase, colors);
        const label = getPhaseLabel(phase);

        return (
            <TouchableOpacity
                testID={`phase-option-${phase}`}
                style={[
                    styles.option,
                    {
                        backgroundColor: isActive ? color + '15' : colors.bgElevated,
                        borderColor: isActive ? color : colors.border
                    }
                ]}
                onPress={() => handleSelect(phase)}
                activeOpacity={0.7}
            >
                <View style={[styles.iconContainer, { backgroundColor: color }]}>
                    <Ionicons name={icon} size={20} color={colors.white} />
                </View>
                <View style={styles.optionText}>
                    <Text style={[styles.optionLabel, { color: colors.textPrimary }]}>{label}</Text>
                    <Text style={[styles.optionDesc, { color: colors.textSecondary }]}>
                        {isActive ? 'Current Phase' : `Switch to ${label}`}
                    </Text>
                </View>
                {isActive && (
                    <Ionicons name="checkmark-circle" size={24} color={color} />
                )}
            </TouchableOpacity>
        );
    };

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
                <Text style={[styles.title, { color: colors.textPrimary }]}>Timer Mode</Text>

                <View style={styles.optionsContainer}>
                    <Option phase="work" icon="flash" />
                    <Option phase="shortBreak" icon="cafe" />
                    <Option phase="longBreak" icon="bed" />
                </View>
            </View>
        </BottomSheet>
    );
});

PhaseSwitcherSheet.displayName = 'PhaseSwitcherSheet';

export default PhaseSwitcherSheet;

const styles = StyleSheet.create({
    content: { paddingHorizontal: 24, paddingTop: 8 },
    title: { fontSize: 20, fontWeight: '700', letterSpacing: -0.5, marginBottom: 20 },
    optionsContainer: { gap: 12 },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    optionText: { flex: 1 },
    optionLabel: { fontSize: 16, fontWeight: '600' },
    optionDesc: { fontSize: 12, marginTop: 2 },
});
