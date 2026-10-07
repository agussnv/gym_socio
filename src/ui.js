import React from 'react';
import { Pressable, Text, View, Platform, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { C, F } from './theme';

export function haptic(kind = 'light') {
  if (Platform.OS === 'web') return;
  try {
    if (kind === 'success') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    else if (kind === 'select') Haptics.selectionAsync();
    else Haptics.impactAsync(kind === 'medium' ? Haptics.ImpactFeedbackStyle.Medium : Haptics.ImpactFeedbackStyle.Light);
  } catch (e) {}
}

const AP = Animated.createAnimatedComponent(Pressable);

// Botón con muelle al pulsar, como en las apps nativas
export function Tap({ onPress, style, children, scale = 0.96, feedback = 'light', disabled, accessibilityLabel, hitSlop }) {
  const s = useSharedValue(1);
  const a = useAnimatedStyle(() => ({ transform: [{ scale: s.value }] }));
  return (
    <AP
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      disabled={disabled}
      hitSlop={hitSlop}
      onPressIn={() => { s.value = withSpring(scale, { damping: 18, stiffness: 400 }); }}
      onPressOut={() => { s.value = withSpring(1, { damping: 14, stiffness: 300 }); }}
      onPress={() => { if (feedback) haptic(feedback); onPress && onPress(); }}
      style={[style, a]}
    >
      {children}
    </AP>
  );
}

export function T({ style, children, f = 'body', size = 15, color = C.text, ...rest }) {
  const fam = { body: F.body, med: F.bodyMed, bold: F.bodyBold, display: F.display, dmed: F.displayMed }[f];
  return <Text {...rest} style={[{ fontFamily: fam, fontSize: size, color }, style]}>{children}</Text>;
}

export function Card({ style, children, border = C.line }) {
  return <View style={[st.card, { borderColor: border }, style]}>{children}</View>;
}

export function Label({ children, style }) {
  return <T f="med" size={12} color={C.mute} style={[{ letterSpacing: 1.2, textTransform: 'uppercase' }, style]}>{children}</T>;
}

export function Button({ title, onPress, kind = 'primary', style, disabled, feedback = 'medium' }) {
  const primary = kind === 'primary';
  return (
    <Tap onPress={onPress} disabled={disabled} feedback={feedback}
      style={[st.btn, primary ? { backgroundColor: disabled ? '#2E2E33' : C.lime } : { borderWidth: 1, borderColor: C.line }, style]}>
      <T f="bold" size={15} color={primary ? (disabled ? C.dim : C.bg) : C.text}>{title}</T>
    </Tap>
  );
}

export function Chip({ title, active, onPress }) {
  return (
    <Tap onPress={onPress} feedback="select" style={[st.chip, active ? { backgroundColor: C.text, borderColor: C.text } : null]}>
      <T f="med" size={13} color={active ? C.bg : C.sub}>{title}</T>
    </Tap>
  );
}

export function Avatar({ ini, size = 40, bg = C.card2, color = C.text }) {
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: bg, alignItems: 'center', justifyContent: 'center' }}>
      <T f="display" size={size * 0.36} color={color}>{ini}</T>
    </View>
  );
}

// Barra que crece con animación
export function Grow({ pct, color, height = 6, style }) {
  const w = useSharedValue(0);
  React.useEffect(() => { w.value = withTiming(pct, { duration: 700 }); }, [pct]);
  const a = useAnimatedStyle(() => ({ width: `${w.value * 100}%` }));
  return (
    <View style={[{ height, borderRadius: height, backgroundColor: C.line, overflow: 'hidden' }, style]}>
      <Animated.View style={[{ height, borderRadius: height, backgroundColor: color }, a]} />
    </View>
  );
}

export const st = StyleSheet.create({
  card: { backgroundColor: C.card, borderRadius: 20, borderWidth: 1, padding: 18 },
  btn: { height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
  chip: { height: 38, paddingHorizontal: 16, borderRadius: 19, borderWidth: 1, borderColor: C.line, alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row', alignItems: 'center' },
});
