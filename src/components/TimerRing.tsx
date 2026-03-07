import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useTheme } from '../context';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface TimerRingProps {
  size?: number;
  strokeWidth?: number;
  progress: number;       // 0 → 1
  color: string;
  children?: React.ReactNode;
}

export default function TimerRing({
  size = 280,
  strokeWidth = 12,
  progress,
  color,
  children,
}: TimerRingProps) {
  const { colors } = useTheme();
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const animatedProgress = useSharedValue(progress);

  useEffect(() => {
    animatedProgress.value = withTiming(progress, {
      duration: 500,
      easing: Easing.out(Easing.quad),
    });
  }, [progress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - animatedProgress.value),
  }));

  // Glow ring props (subtle outer glow)
  const glowProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - animatedProgress.value),
  }));

  const center = size / 2;

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        {/* Track ring */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={colors.ringTrack}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Glow ring (subtle) */}
        <AnimatedCircle
          cx={center}
          cy={center}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth + 4}
          fill="transparent"
          strokeDasharray={`${circumference} ${circumference}`}
          animatedProps={glowProps}
          strokeLinecap="butt"
          rotation="-90"
          origin={`${center}, ${center}`}
          opacity={0.15}
        />
        {/* Progress ring */}
        <AnimatedCircle
          cx={center}
          cy={center}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={`${circumference} ${circumference}`}
          animatedProps={animatedProps}
          strokeLinecap="butt"
          rotation="-90"
          origin={`${center}, ${center}`}
        />
      </Svg>
      {/* Inner content */}
      <View style={styles.inner}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  inner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
