import React, { useEffect } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import Animated, { FadeInDown, ZoomIn, useSharedValue, useAnimatedStyle, withRepeat, withTiming, withDelay, Easing } from 'react-native-reanimated';
import { useStore } from '../store';
import { T, Card, Label, Button, st } from '../ui';
import Icon from '../icons';
import { C } from '../theme';
import { COACH } from '../data';
import { mmss } from './Workout';

function Ring() {
  const r = useSharedValue(0);
  useEffect(() => { r.value = withRepeat(withTiming(1, { duration: 1800, easing: Easing.out(Easing.ease) }), -1, false); }, []);
  const a = useAnimatedStyle(() => ({ opacity: 1 - r.value, transform: [{ scale: 1 + r.value * 0.8 }] }));
  return <Animated.View style={[styles.ring, a]} />;
}

export default function Summary() {
  const { s, set } = useStore();
  const x = s.summary;
  const stats = [['Duración', mmss(x.elapsed)], ['Volumen total', `${x.volume.toLocaleString('es-ES')} kg`], ['Series', String(x.doneCount)], ['Récords', String(x.prs.length)]];
  return (
    <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 40 }}>
      <View style={{ alignItems: 'center' }}>
        <View style={{ width: 96, height: 96, alignItems: 'center', justifyContent: 'center' }}>
          <Ring />
          <Animated.View entering={ZoomIn.springify().damping(10)} style={styles.badge}>
            <Icon name="check" size={44} color={C.bg} stroke={3} />
          </Animated.View>
        </View>
        <Animated.View entering={FadeInDown.delay(200)}>
          <T size={14} color={C.mute} style={{ marginTop: 22, textAlign: 'center' }}>{x.name} · hoy</T>
          <T f="display" size={28} style={{ marginTop: 6, textAlign: 'center' }}>Entrenamiento completado</T>
        </Animated.View>
      </View>

      <View style={styles.grid}>
        {stats.map(([k, v], i) => (
          <Animated.View key={k} entering={FadeInDown.delay(300 + i * 80)} style={styles.cell}>
            <T size={12} color={C.mute}>{k}</T>
            <T f="display" size={22} style={{ marginTop: 4 }}>{v}</T>
          </Animated.View>
        ))}
      </View>

      {x.prs.length > 0 && (
        <Animated.View entering={FadeInDown.delay(650)}>
          <Card style={{ marginTop: 14 }} border={C.limeLine}>
            <View style={[st.row, { gap: 8 }]}><Icon name="trophy" size={18} color={C.lime} /><Label style={{ color: C.lime }}>Nuevos récords</Label></View>
            {x.prs.map((p) => (
              <View key={p.name} style={[st.row, { justifyContent: 'space-between', marginTop: 10 }]}>
                <T f="med">{p.name}</T><T f="display" color={C.lime}>{p.val}</T>
              </View>
            ))}
          </Card>
        </Animated.View>
      )}

      {x.notes.length > 0 && (
        <Animated.View entering={FadeInDown.delay(750)}>
          <Card style={{ marginTop: 14 }}>
            <Label>Notas para {COACH}</Label>
            {x.notes.map((n) => (
              <View key={n.name} style={{ marginTop: 10 }}>
                <T f="med" size={13} color={C.mute}>{n.name}</T>
                <T size={14} style={{ marginTop: 2 }}>{n.text}</T>
              </View>
            ))}
            <T size={12} color={C.dim} style={{ marginTop: 12 }}>{COACH} las verá en su tablet al revisar tu rutina.</T>
          </Card>
        </Animated.View>
      )}

      <Animated.View entering={FadeInDown.delay(850)}>
        <Button title="Guardar" style={{ marginTop: 24 }} feedback="success" onPress={() => set({ summary: null, tab: 'perfil' })} />
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  badge: { width: 88, height: 88, borderRadius: 44, backgroundColor: C.lime, alignItems: 'center', justifyContent: 'center' },
  ring: { position: 'absolute', width: 88, height: 88, borderRadius: 44, borderWidth: 2, borderColor: C.lime },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 28 },
  cell: { width: '48%', flexGrow: 1, backgroundColor: C.card, borderRadius: 18, borderWidth: 1, borderColor: C.line, padding: 16 },
});
