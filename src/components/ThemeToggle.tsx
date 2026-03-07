import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context';

export default function ThemeToggle() {
    const { isDark, toggle, colors } = useTheme();

    return (
        <TouchableOpacity
            style={[styles.btn, { backgroundColor: colors.bgElevated, borderColor: colors.border }]}
            onPress={toggle}
            activeOpacity={0.7}
        >
            <Ionicons
                name={isDark ? 'sunny-outline' : 'moon-outline'}
                size={18}
                color={colors.textSecondary}
            />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    btn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
    },
});
