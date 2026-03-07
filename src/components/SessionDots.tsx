import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../context';

interface SessionDotsProps {
  total: number;
  completed: number;
  activeColor: string;
}

export default function SessionDots({ total, completed, activeColor }: SessionDotsProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            i < completed
              ? { backgroundColor: activeColor }
              : { backgroundColor: colors.border },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
