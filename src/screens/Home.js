import React, { useEffect, useState } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import Animated, { FadeInDown, FadeInUp, FadeOutDown, useSharedValue, useAnimatedStyle, withRepeat, withTiming, withDelay, withSpring, Easing } from 'react-native-reanimated';
import { useStore } from '../store';
import { T, Card, Label, Tap, Button, Grow, st } from '../ui';
import Icon from '../icons';
import { C } from '../theme';
import { startWorkout } from './Train';
import { GYM, CAPACITY, HOURLY, COACH_ROUTINES, EX, SCHEDULE } from '../data';

function LiveDot() {
  const o = useSharedValue(1);
  useEffect(() => { o.value = withRepeat(withTiming(0.25, { duration: 900, easing: Easing.inOut(Easing.ease) }), -1, true); }, []);
  const a = useAnimatedStyle(() => ({ opacity: o.value }));
  return <Animated.View style={[{ width: 8, height: 8, borderRadius: 4, backgroundColor: C.lime }, a]} />;
}

function Bar({ v, i, on, onPress }) {
  const h = useSharedValue(0);
  useEffect(() => { h.value = withDelay(i * 35, withSpring(v, { damping: 16, stiffness: 120 })); }, []);
  const a = useAnimatedStyle(() => ({ height: `${h.value}%` }));
  return (
    <Tap onPress={onPress} feedback="select" scale={0.85} style={styles.barHit} accessibilityLabel={`${7 + i}:00`}>
      <Animated.View style={[styles.bar, { backgroundColor: on ? C.lime : '#2E2E33' }, a]} />
    </Tap>
  );
}

export default function Home() {
  const { s, set } = useStore();
  const [bar, setBar] = useState(7);
  const occ = s.people / CAPACITY;
  const occLabel = occ < 0.5 ? 'Ocupación baja · buen momento' : occ < 0.8 ? 'Ocupación media' : 'Ocupación alta';
  const est = Math.round((HOURLY[bar] / 100) * CAPACITY * 0.8);
  const barInfo = bar === 7 ? `Ahora: ~${s.people} personas. Mejor franja: 14:00 – 16:00` : `A las ${7 + bar}:00 suele haber ~${est} personas`;
  const today = COACH_ROUTINES.find((r) => r.next);
  const di = Math.min(5, (new Date().getDay() + 6) % 7);
  const [cTime, cName, cCoach, cFree] = SCHEDULE[di][0];
  const classKey = di + '-0';
  const booked = !!s.booked[classKey];

  return (
    <ScrollView contentContainerStyle={styles.wrap} showsVerticalScrollIndicator={false}>
      <Animated.View entering={FadeInDown.duration(400)} style={[st.row, { justifyContent: 'space-between', marginBottom: 22 }]}>
        <View>
          <Label>{GYM}</Label>
          <T f="display" size={30} style={{ marginTop: 6 }}>Hola, Marta</T>
        </View>
        <Tap style={styles.bell} accessibilityLabel="Notificaciones" onPress={() => {}}>
          <Icon name="bell" size={22} />
          <View style={styles.badge} />
        </Tap>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(80).duration(450)}>
        <Card>
          <View style={[st.row, { justifyContent: 'space-between' }]}>
            <Label>Ahora en el gimnasio</Label>
            <View style={[st.row, { gap: 6 }]}><LiveDot /><T f="med" size={12} color={C.lime}>En directo</T></View>
          </View>
          <View style={[st.row, { alignItems: 'flex-end', marginTop: 12, gap: 10 }]}>
            <View style={{ height: 64, overflow: 'hidden', justifyContent: 'flex-end' }}>
              <Animated.View key={s.people} entering={FadeInUp.duration(350)}>
                <T f="display" size={60} style={{ lineHeight: 64 }}>{s.people}</T>
              </Animated.View>
            </View>
            <T size={15} color={C.mute} style={{ marginBottom: 10 }}>de {CAPACITY} de aforo</T>
          </View>
          <Grow pct={occ} color={C.lime} style={{ marginTop: 14 }} />
          <T f="med" size={13} color={C.sub} style={{ marginTop: 10 }}>{occLabel}</T>
        </Card>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(160).duration(450)}>
        <Card style={{ marginTop: 14 }}>
          <View style={[st.row, { justifyContent: 'space-between' }]}>
            <Label>Hoy, por horas</Label>
            <T size={12} color={C.dim}>Toca una barra</T>
          </View>
          <View style={styles.chart}>
            {HOURLY.map((v, i) => <Bar key={i} v={v} i={i} on={i === bar} onPress={() => setBar(i)} />)}
          </View>
          <View style={[st.row, { justifyContent: 'space-between', marginTop: 6 }]}>
            {['7h', '11h', '15h', '19h', '23h'].map((h) => <T key={h} size={11} color={C.dim}>{h}</T>)}
          </View>
          <Animated.View key={bar} entering={FadeInUp.duration(250)}>
            <T f="med" size={14} style={{ marginTop: 12 }}>{barInfo}</T>
          </Animated.View>
        </Card>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(240).duration(450)}>
        <Tap scale={0.98} onPress={() => startWorkout(set, today)}>
          <Card style={{ marginTop: 14 }} border={C.line2}>
            <View style={[st.row, { justifyContent: 'space-between' }]}>
              <Label>Toca hoy</Label>
              <View style={styles.tag}><T f="bold" size={11} color={C.bg}>DE TU ENTRENADOR</T></View>
            </View>
            <T f="display" size={22} style={{ marginTop: 10 }}>{today.name}</T>
            <T size={14} color={C.mute} style={{ marginTop: 4 }}>{today.ids.map((id) => EX[id].name).join(' · ')}</T>
            <View style={[st.row, { marginTop: 14, gap: 8 }]}>
              <Icon name="play" size={16} color={C.lime} />
              <T f="bold" size={14} color={C.lime}>Empezar ahora</T>
            </View>
          </Card>
        </Tap>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(320).duration(450)}>
        <Card style={{ marginTop: 14 }}>
          <Label>Próxima clase</Label>
          <View style={[st.row, { justifyContent: 'space-between', marginTop: 10 }]}>
            <View>
              <T f="display" size={20}>{cName} · {cTime}</T>
              <T size={13} color={booked ? C.lime : C.mute} style={{ marginTop: 4 }}>{booked ? 'Plaza reservada' : `Con ${cCoach} · ${cFree} plazas libres`}</T>
            </View>
            <Button title={booked ? 'Reservada' : 'Reservar'} kind={booked ? 'ghost' : 'primary'} style={{ height: 44 }}
              feedback={booked ? 'light' : 'success'}
              onPress={() => set((p) => ({ booked: { ...p.booked, [classKey]: !p.booked[classKey] } }))} />
          </View>
        </Card>
      </Animated.View>
      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: 20, paddingTop: 16 },
  bell: { width: 44, height: 44, borderRadius: 22, backgroundColor: C.card, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.line },
  badge: { position: 'absolute', top: 10, right: 11, width: 8, height: 8, borderRadius: 4, backgroundColor: C.lime },
  chart: { flexDirection: 'row', alignItems: 'flex-end', height: 110, marginTop: 16, gap: 4 },
  barHit: { flex: 1, height: '100%', justifyContent: 'flex-end' },
  bar: { width: '100%', borderRadius: 4 },
  tag: { backgroundColor: C.lime, borderRadius: 6, paddingHorizontal: 7, paddingVertical: 3 },
});
