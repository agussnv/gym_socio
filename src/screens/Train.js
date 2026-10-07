import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import Animated, { FadeInDown, LinearTransition } from 'react-native-reanimated';
import { useStore } from '../store';
import { T, Card, Label, Tap, Button, Grow, Avatar, st } from '../ui';
import Icon from '../icons';
import { C } from '../theme';
import { COACH_ROUTINES, EX, COACH } from '../data';

export const startWorkout = (set, routine) => set({ workout: { routine, done: {}, extra: {}, notes: {}, restEdit: {}, start: Date.now() } });

function RoutineCard({ r, own, i }) {
  const { set } = useStore();
  const hot = r.next;
  return (
    <Animated.View entering={FadeInDown.delay(80 + i * 70).duration(420)} layout={LinearTransition.springify()}>
      <Card style={{ marginTop: 12 }} border={hot ? C.line2 : C.line}>
        <View style={[st.row, { justifyContent: 'space-between' }]}>
          <T f="display" size={19} style={{ flex: 1 }}>{r.name}</T>
          {hot && <View style={styles.tag}><T f="bold" size={11} color={C.bg}>TOCA HOY</T></View>}
        </View>
        <View style={[st.row, { gap: 8, marginTop: 8 }]}>
          {own
            ? <T size={12} color={C.dim}>Creada por ti</T>
            : <><Avatar ini="D" size={20} bg={C.lime} color={C.bg} /><T size={12} color={C.mute}>Asignada por {COACH}</T></>}
        </View>
        <T size={14} color={C.sub} style={{ marginTop: 10, lineHeight: 20 }}>{r.ids.map((id) => EX[id].name).join(', ')}</T>
        <T size={12} color={C.dim} style={{ marginTop: 6 }}>{r.ids.length} ejercicios{r.last ? ` · Última vez: ${r.last}` : ''}</T>
        <Button title="Empezar rutina" kind={hot ? 'primary' : 'ghost'} style={{ marginTop: 14, height: 46 }} onPress={() => startWorkout(set, { ...r, own })} />
      </Card>
    </Animated.View>
  );
}

export default function Train() {
  const { s, set } = useStore();
  return (
    <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 16 }} showsVerticalScrollIndicator={false}>
      <View style={[st.row, { justifyContent: 'space-between' }]}>
        <T f="display" size={30}>Entrenar</T>
        <Tap onPress={() => set({ creating: true })} style={styles.create}>
          <Icon name="plus" size={16} color={C.lime} />
          <T f="bold" size={13} color={C.lime}>Crear rutina</T>
        </Tap>
      </View>

      <Animated.View entering={FadeInDown.duration(400)}>
        <Card style={{ marginTop: 20 }}>
          <Label>De tu entrenador</Label>
          <T f="dmed" size={17} style={{ marginTop: 8 }}>Plan Fuerza · semana 3 de 8</T>
          <Grow pct={3 / 8} color={C.lime} style={{ marginTop: 12 }} />
        </Card>
      </Animated.View>

      {COACH_ROUTINES.map((r, i) => <RoutineCard key={r.id} r={r} i={i} />)}

      <Label style={{ marginTop: 28 }}>Creadas por ti</Label>
      {s.myRoutines.map((r, i) => <RoutineCard key={r.id} r={r} own i={i + 3} />)}
      <Tap onPress={() => set({ creating: true })} style={styles.dashed} scale={0.98}>
        <Icon name="plus" size={18} color={C.mute} />
        <T f="med" size={14} color={C.mute}>Crea tu propia rutina</T>
      </Tap>
      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tag: { backgroundColor: C.lime, borderRadius: 6, paddingHorizontal: 7, paddingVertical: 3 },
  create: { flexDirection: 'row', alignItems: 'center', gap: 6, height: 40, paddingHorizontal: 14, borderRadius: 20, backgroundColor: C.limeSoft },
  dashed: { marginTop: 12, height: 64, borderRadius: 20, borderWidth: 1, borderStyle: 'dashed', borderColor: C.line2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
});
