import React, { useEffect, useState } from 'react';
import { ScrollView, View, StyleSheet, Pressable } from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown, useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '../store';
import { T, Card, Label, Tap, Avatar, st } from '../ui';
import Icon from '../icons';
import { C } from '../theme';
import { EX, COACH } from '../data';

function Video() {
  const [playing, setPlaying] = useState(false);
  const p = useSharedValue(0);
  useEffect(() => {
    if (playing) p.value = withTiming(1, { duration: 45000, easing: Easing.linear });
  }, [playing]);
  const a = useAnimatedStyle(() => ({ width: `${p.value * 100}%` }));
  return (
    <Tap scale={0.98} onPress={() => setPlaying(true)} style={styles.video} accessibilityLabel="Reproducir vídeo">
      {!playing && (
        <Animated.View exiting={FadeOut} style={styles.play}><Icon name="play" size={26} color={C.bg} /></Animated.View>
      )}
      {playing && <Animated.View entering={FadeIn}><T f="med" size={13} color={C.sub}>Reproduciendo…</T></Animated.View>}
      <T size={12} color={C.mute} style={{ position: 'absolute', left: 14, bottom: 14 }}>Vídeo del entrenador · 0:45</T>
      <View style={styles.track}><Animated.View style={[styles.fill, a]} /></View>
    </Tap>
  );
}

export default function ExerciseSheet() {
  const { s, set } = useStore();
  const insets = useSafeAreaInsets();
  const { id, own } = s.detail;
  const e = EX[id];
  const close = () => set({ detail: null });
  return (
    <View style={[StyleSheet.absoluteFill, { zIndex: 30 }]}>
      <Animated.View entering={FadeIn.duration(200)} exiting={FadeOut.duration(200)} style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.6)' }]}>
        <Pressable style={{ flex: 1 }} onPress={close} accessibilityLabel="Cerrar" />
      </Animated.View>
      <Animated.View entering={SlideInDown.duration(260).easing(Easing.bezier(0.2, 0.8, 0.2, 1))} exiting={SlideOutDown.duration(220)} style={[styles.sheet, { paddingBottom: insets.bottom + 16, top: insets.top + 40 }]}>
        <View style={styles.grab} />
        <View style={[st.row, { justifyContent: 'space-between', paddingHorizontal: 20 }]}>
          <Label>Cómo se hace</Label>
          <Tap onPress={close} style={styles.x} accessibilityLabel="Cerrar"><Icon name="close" size={18} /></Tap>
        </View>
        <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 12 }}>
          <Video />
          <T f="display" size={24} style={{ marginTop: 18 }}>{e.name}</T>
          <T size={14} color={C.mute} style={{ marginTop: 4 }}>{e.muscle}</T>
          <Label style={{ marginTop: 22 }}>Paso a paso</Label>
          {e.steps.map((t, i) => (
            <Animated.View key={i} style={[st.row, { alignItems: 'flex-start', gap: 12, marginTop: 12 }]}>
              <View style={styles.num}><T f="bold" size={12} color={C.lime}>{i + 1}</T></View>
              <T size={15} color={C.sub} style={{ flex: 1, lineHeight: 22 }}>{t}</T>
            </Animated.View>
          ))}
          <Card style={{ marginTop: 20, backgroundColor: 'rgba(255,176,84,0.08)' }} border="rgba(255,176,84,0.3)">
            <T f="bold" size={13} color={C.orange}>Error común</T>
            <T size={14} color={C.sub} style={{ marginTop: 6, lineHeight: 20 }}>{e.tip}</T>
          </Card>
          {!own && e.coach && (
            <Card style={{ marginTop: 12 }}>
              <View style={[st.row, { gap: 10 }]}>
                <Avatar ini="DA" size={32} bg={C.lime} color={C.bg} />
                <T f="med" size={13} color={C.mute}>Nota de {COACH}, tu entrenador</T>
              </View>
              <T size={15} style={{ marginTop: 10, lineHeight: 22 }}>{e.coach}</T>
            </Card>
          )}
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: C.bg, borderTopLeftRadius: 28, borderTopRightRadius: 28, borderWidth: 1, borderColor: C.line2 },
  grab: { alignSelf: 'center', width: 40, height: 5, borderRadius: 3, backgroundColor: C.line2, marginTop: 10, marginBottom: 10 },
  x: { width: 36, height: 36, borderRadius: 18, backgroundColor: C.card, alignItems: 'center', justifyContent: 'center' },
  video: { height: 200, borderRadius: 20, backgroundColor: C.card2, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  play: { width: 60, height: 60, borderRadius: 30, backgroundColor: C.lime, alignItems: 'center', justifyContent: 'center', paddingLeft: 3 },
  track: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 3, backgroundColor: C.line },
  fill: { height: 3, backgroundColor: C.lime },
  num: { width: 26, height: 26, borderRadius: 13, backgroundColor: C.limeSoft, alignItems: 'center', justifyContent: 'center' },
});
