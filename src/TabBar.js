import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from './store';
import { Tap, T } from './ui';
import Icon from './icons';
import { C } from './theme';

const TABS = [
  ['inicio', 'Inicio', 'home'],
  ['entrenar', 'Entrenar', 'dumbbell'],
  ['clases', 'Clases', 'calendar'],
  ['acceso', 'Acceso', 'qr'],
  ['perfil', 'Perfil', 'user'],
];

export default function TabBar() {
  const { s, set } = useStore();
  const insets = useSafeAreaInsets();
  const [w, setW] = useState(0);
  const idx = TABS.findIndex((t) => t[0] === s.tab);
  const x = useSharedValue(0);
  const tw = w / TABS.length;
  useEffect(() => { x.value = withSpring(idx * tw, { damping: 20, stiffness: 220 }); }, [idx, tw]);
  const pill = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      <View style={styles.inner} onLayout={(e) => setW(e.nativeEvent.layout.width)}>
        {w > 0 && (
          <Animated.View style={[styles.pill, { width: tw }, pill]}>
            <View style={styles.dot} />
          </Animated.View>
        )}
        {TABS.map(([id, label, icon]) => {
          const on = id === s.tab;
          return (
            <Tap key={id} feedback="select" scale={0.9} onPress={() => set({ tab: id })} style={styles.tab} accessibilityLabel={label}>
              <Icon name={icon} size={23} color={on ? C.lime : C.dim} />
              <T f="med" size={11} color={on ? C.text : C.dim} style={{ marginTop: 4 }}>{label}</T>
            </Tap>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { borderTopWidth: 1, borderTopColor: C.line, backgroundColor: C.bg, paddingTop: 8 },
  inner: { flexDirection: 'row' },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center', height: 54 },
  pill: { position: 'absolute', top: -8, height: 3, alignItems: 'center' },
  dot: { width: 28, height: 3, borderRadius: 2, backgroundColor: C.lime },
});
